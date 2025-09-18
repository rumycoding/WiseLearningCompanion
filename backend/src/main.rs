use axum::{
    extract::Json as ExtractJson,
    response::Json,
    routing::{get, post},
    Router,
};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use tower_http::cors::CorsLayer;
use tracing::{info, warn};

#[derive(Debug, Deserialize)]
struct WordQuery {
    word: String,
    #[serde(default)]
    lang: Option<String>,   // language of the translated word
    difficulty: Option<String>
}

#[derive(Debug, Serialize, Clone)]
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
async fn query_word(ExtractJson(query): ExtractJson<WordQuery>) -> Json<QueryResponse> {
    info!("Querying word: {}, language: {:?}, difficulty: {:?}", query.word, query.lang, query.difficulty);
    
    // Create mock data for Chinese characters with English and Chinese definitions
    let mut mock_definitions = HashMap::new();
    
    // 天 (sky/heaven)
    mock_definitions.insert(("天", "en"), WordDefinition {
        word: "天".to_string(),
        definition: "Sky, heaven, day".to_string(),
        examples: vec![
            "今天天气很好 - The weather is very good today".to_string(),
            "天空很蓝 - The sky is very blue".to_string(),
        ],
    });
    
    mock_definitions.insert(("天", "zh"), WordDefinition {
        word: "天".to_string(),
        definition: "天空，上天，一日".to_string(),
        examples: vec![
            "今天天气很好".to_string(),
            "天空很蓝".to_string(),
        ],
    });
    
    // 地 (earth/ground)
    mock_definitions.insert(("地", "en"), WordDefinition {
        word: "地".to_string(),
        definition: "Earth, ground, land".to_string(),
        examples: vec![
            "大地很广阔 - The earth is vast".to_string(),
            "他坐在地上 - He sits on the ground".to_string(),
        ],
    });
    
    mock_definitions.insert(("地", "zh"), WordDefinition {
        word: "地".to_string(),
        definition: "大地，土地，地面".to_string(),
        examples: vec![
            "大地很广阔".to_string(),
            "他坐在地上".to_string(),
        ],
    });
    
    // 人 (person/people)
    mock_definitions.insert(("人", "en"), WordDefinition {
        word: "人".to_string(),
        definition: "Person, people, human being".to_string(),
        examples: vec![
            "他是一个好人 - He is a good person".to_string(),
            "人们很友善 - People are very friendly".to_string(),
        ],
    });
    
    mock_definitions.insert(("人", "zh"), WordDefinition {
        word: "人".to_string(),
        definition: "人类，人员，个人".to_string(),
        examples: vec![
            "他是一个好人".to_string(),
            "人们很友善".to_string(),
        ],
    });
    
    // Determine language (default to English if not specified)
    let lang = query.lang.as_deref().unwrap_or("en");
    
    // Look up the word in our mock data
    match mock_definitions.get(&(query.word.as_str(), lang)) {
        Some(definition) => {
            info!("Found definition for word: {} in language: {}", query.word, lang);
            Json(QueryResponse {
                success: true,
                data: Some(definition.clone()),
                message: format!("Definition found for '{}' in {}", query.word, lang),
            })
        },
        None => {
            warn!("No definition found for word: {} in language: {}", query.word, lang);
            Json(QueryResponse {
                success: false,
                data: None,
                message: format!("No definition found for '{}' in language '{}'", query.word, lang),
            })
        }
    }
}

#[tokio::main]
async fn main() {
    // Initialize tracing
    tracing_subscriber::fmt::init();
    
    // Build our application with routes
    let app = Router::new()
        .route("/", get(health))
        .route("/health", get(health))
        .route("/query", post(query_word))
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
