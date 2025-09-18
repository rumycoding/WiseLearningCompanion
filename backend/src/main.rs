use axum::{
    extract::{Json as ExtractJson, State},
    response::Json,
    routing::{get, post},
    Router,
};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use tower_http::cors::CorsLayer;
use tracing::{info, warn};
use rig::{agent::Agent, client::{CompletionClient, ProviderClient}, completion::Prompt, providers::azure};
use dotenv::dotenv;


#[derive(Clone)]
struct AppState {
    llm_client: Agent<azure::CompletionModel>,
}

#[derive(Debug, Deserialize)]
struct WordQuery {
    word: String,
    #[serde(default)]
    lang: Option<String>,   // language of the translated word
    difficulty: Option<String>
}

#[derive(Debug, Serialize, Clone, Deserialize)]
struct WordDefinition {
    word: String,
    definition: String,
    examples: Vec<String>,
}

#[derive(Debug, Serialize)]
struct QueryResponse {
    success: bool,
    data: Option<WordDefinition>,
    message: String,
}

#[derive(Debug, Serialize)]
struct HealthResponse {
    status: String,
    message: String,
}

// Health check endpoint
async fn health() -> Json<HealthResponse> {
    Json(HealthResponse {
        status: "healthy".to_string(),
        message: "Word Query Backend is running".to_string(),
    })
}

// Query word with JSON body
async fn query_word(
    State(app_state): State<AppState>,
    ExtractJson(query): ExtractJson<WordQuery>
) -> Json<QueryResponse> {
    info!("Querying word: {}, language: {:?}, difficulty: {:?}", query.word, query.lang, query.difficulty);

    
    // Determine language (default to English if not specified)
    let lang = query.lang.as_deref().unwrap_or("en");
    let difficulty = query.difficulty.as_deref().unwrap_or("beginner");

    let prompt_text = format!(
        "You are a Chinese language tutor. Provide a definition for the Chinese word '{0}' in {1} language.
        Difficulty level: {2}
        
        Respond with a JSON object containing:
        - word: the Chinese character(s)
        - definition: short definition in the requested language
        - examples: array of 2 example sentences
        
        Example response for the word '你好' in English language with beginner difficulty:
        {{
            \"word\": \"你好\",
            \"definition\": \"A common greeting meaning 'hello' or 'hi' in Chinese.\",
            \"examples\": [
                \"你好，很高兴见到你。(Hello, nice to meet you.)\",
                \"老师走进教室说：'你好，同学们！'(The teacher walked into the classroom and said: 'Hello, students!')\"
            ]
        }}

        Example response for the word '你好' in Chinese language with beginner difficulty:
        {{
            \"word\": \"你好\",
            \"definition\": \"打招呼用语\",
            \"examples\": [
                \"你好，很高兴见到你。\",
                \"老师走进教室说：'你好，同学们！'\"
            ]
        }}
        
        Now provide the definition for '{0}' in {1} language with {2} difficulty level.
        Format your response as valid JSON only, no additional text.",
        query.word, lang, difficulty
    );

    match app_state.llm_client
        .prompt(&prompt_text)
        .await 
    {
        Ok(llm_response) => {
            info!("Got LLM response for word: {}", query.word);
            
            match serde_json::from_str::<WordDefinition>(&llm_response) {
            Ok(parsed) => {
                Json(QueryResponse {
                    success: true,
                    data: Some(parsed),
                    message: format!("Definition found for '{}' in {}", query.word, lang),
                })
            },
            Err(e) => {
                warn!("Failed to parse JSON response: {}", e);
                Json(QueryResponse {
                    success: false,
                    data: None,
                    message: "Failed to parse LLM response".to_string(),
                })
            }
        }
        },
        Err(e) => {
            warn!("Failed to get LLM response for word: {} - Error: {}", query.word, e);
            Json(QueryResponse {
                success: false,
                data: None,
                message: format!("Failed to get definition for '{}': {}", query.word, e),
            })
        }
    }
}

#[tokio::main]
async fn main() {
    // Initialize tracing
    tracing_subscriber::fmt::init();

    // Load .env file
    dotenv().ok();

    let llm_client = azure::Client::from_env();
    let gpt4onano = llm_client.agent("gpt-4.1-nano").build();

    // Initialize the app state
    let app_state = AppState {
        llm_client: gpt4onano,
    };
    
    // Build our application with routes
    let app = Router::new()
        .route("/", get(health))
        .route("/health", get(health))
        .route("/query", post(query_word))
        .with_state(app_state)
        // Add CORS layer to allow frontend requests
        .layer(CorsLayer::permissive());
    
    // Run the server
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3001")
        .await
        .unwrap();
    
    info!("🚀 Word Query Backend server starting on http://0.0.0.0:3001");
    info!("📚 Available endpoints:");
    info!("  GET  /health           - Health check");
    info!("  POST /query            - Query word definition");
    info!("                         - Content-Type: application/json");
    info!("                         - Body: {{\"word\": \"天\", \"lang\": \"en\", \"difficulty\": \"beginner\"}}");
    info!("                         - Supported languages: en, zh");
    
    axum::serve(listener, app).await.unwrap();
}
