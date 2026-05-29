import streamlit as st
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_chroma import Chroma
from langchain.chains.conversational_retrieval.base import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain.prompts import PromptTemplate
import os
import csv
from datetime import datetime

# SUA CHAVE FUNCIONAL AQUI (a que deu 3072)
API_KEY = "COLE SUA CHAVE AQUI"

st.set_page_config(page_title="SegurAI Assistente", page_icon="🛡️", layout="centered")

# --- CONFIGURAÇÃO DA PÁGINA ---
st.set_page_config(
    page_title="SegurAI Assistente",
    page_icon="🛡️",
    layout="centered"
)

# --- CSS CUSTOMIZADO (visual do HTML) ---
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Lato:wght@300;400;700&display=swap');

html, body, [class*="css"] {
    font-family: 'Lato', sans-serif;
    background-color: #FAFAFA;
    color: #1A202C;
}

#MainMenu {visibility: hidden;}
footer {visibility: hidden;}
header {visibility: hidden;}

.stApp { background-color: #FAFAFA; }

.block-container {
    padding-top: 2rem;
    padding-bottom: 2rem;
    max-width: 860px;
}

h1 {
    font-family: 'Playfair Display', serif !important;
    color: #0B2D62 !important;
    font-size: 2.2rem !important;
    font-weight: 600 !important;
    letter-spacing: -0.01em;
    margin-bottom: 0.25rem !important;
}

h2, h3 {
    font-family: 'Playfair Display', serif !important;
    color: #0B2D62 !important;
}

.stAlert {
    background-color: #E6F0FF !important;
    border: 1px solid #0B2D62 !important;
    border-left: 4px solid #00915A !important;
    border-radius: 2px !important;
    color: #0B2D62 !important;
    font-family: 'Lato', sans-serif;
    font-size: 0.9rem;
}

.stChatMessage {
    background-color: #F4F6F9 !important;
    border-radius: 2px !important;
    border: 1px solid #E2E8F0 !important;
    margin-bottom: 0.75rem !important;
    font-family: 'Lato', sans-serif !important;
    font-size: 1rem !important;
}

.stChatMessage[data-testid="stChatMessage-user"] {
    background-color: #0B2D62 !important;
    border: none !important;
}
.stChatMessage[data-testid="stChatMessage-user"] p { color: #FFFFFF !important; }
.stChatMessage[data-testid="stChatMessage-assistant"] p {
    color: #1A202C !important;
    line-height: 1.8;
}

.stChatMessage .stAvatar {
    background-color: #0B2D62 !important;
    border-radius: 2px !important;
}

.stChatInputContainer {
    border-top: 1px solid #E2E8F0 !important;
    background-color: #FFFFFF !important;
    padding: 1rem 0 !important;
}

.stChatInput {
    border: none !important;
    border-bottom: 1px solid #E2E8F0 !important;
    border-radius: 0 !important;
    background-color: transparent !important;
    font-family: 'Lato', sans-serif !important;
    font-size: 1rem !important;
    color: #1A202C !important;
    box-shadow: none !important;
}

.stChatInput:focus {
    border-bottom: 1px solid #0B2D62 !important;
    box-shadow: none !important;
}

.stSpinner > div { border-top-color: #00915A !important; }

.streamlit-expanderHeader {
    font-family: 'Lato', sans-serif !important;
    font-size: 0.8rem !important;
    color: #808A93 !important;
    background-color: #F8F9FA !important;
    border: 1px solid #E2E8F0 !important;
    border-radius: 2px !important;
}

.streamlit-expanderContent {
    background-color: #F8F9FA !important;
    border: 1px solid #E2E8F0 !important;
    border-top: none !important;
    font-size: 0.85rem !important;
    color: #4A5568 !important;
}

section[data-testid="stSidebar"] {
    background-color: #0B2D62 !important;
    border-right: none !important;
}

section[data-testid="stSidebar"] * {
    color: #FFFFFF !important;
    font-family: 'Lato', sans-serif !important;
}

section[data-testid="stSidebar"] h1,
section[data-testid="stSidebar"] h2,
section[data-testid="stSidebar"] h3 {
    font-family: 'Playfair Display', serif !important;
    color: #FFFFFF !important;
}

section[data-testid="stSidebar"] .stButton button {
    background-color: transparent !important;
    border: 1px solid rgba(255,255,255,0.4) !important;
    color: #FFFFFF !important;
    border-radius: 2px !important;
    font-family: 'Lato', sans-serif !important;
    font-size: 0.8rem !important;
    letter-spacing: 0.08em !important;
    text-transform: uppercase !important;
    width: 100% !important;
    transition: all 0.3s ease !important;
}

section[data-testid="stSidebar"] .stButton button:hover {
    background-color: #00915A !important;
    border-color: #00915A !important;
}

.status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.75rem;
    color: #808A93;
    font-family: 'Lato', sans-serif;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin-bottom: 1.5rem;
}

.status-dot {
    width: 8px;
    height: 8px;
    background-color: #00915A;
    border-radius: 50%;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.4; }
    100% { opacity: 1; }
}

.header-bar {
    width: 48px;
    height: 3px;
    background-color: #00915A;
    margin-bottom: 1.5rem;
    border-radius: 0;
}

.footer-text {
    text-align: center;
    font-size: 0.7rem;
    color: #808A93;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid #E2E8F0;
    font-family: 'Lato', sans-serif;
}

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: #F4F6F9; }
::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 2px; }
::-webkit-scrollbar-thumb:hover { background: #0B2D62; }
</style>
""", unsafe_allow_html=True)

# --- PROMPT COM PERSONA E REGRAS ÉTICAS ---
SYSTEM_PROMPT = """Você é o SegurAI Assistente, um chatbot de atendimento inicial para segurados da InsurTech Minds.

Regras obrigatórias:
- Responda de forma clara, objetiva e educada.
- Use SOMENTE as informações recuperadas da base de conhecimento abaixo.
- Não invente coberturas, valores, prazos ou regras específicas.
- Sempre informe que a apólice e a seguradora/corretora são as fontes oficiais.
- Nunca forneça dados pessoais de outros clientes.
- Quando o caso envolver urgência, vítima, sinistro complexo, dados pessoais ou decisão contratual, recomende atendimento humano.
- Se não souber a resposta com base nos documentos, diga isso claramente.

Base de conhecimento recuperada:
{context}

Histórico da conversa:
{chat_history}

Pergunta do segurado: {question}

Resposta:"""

QA_PROMPT = PromptTemplate(
    input_variables=["context", "chat_history", "question"],
    template=SYSTEM_PROMPT
)

# --- CARREGAMENTO DO RAG ---
@st.cache_resource
def carregar_rag():
    loader = DirectoryLoader(
        "docs",
        glob="*.txt",
        loader_cls=TextLoader,
        loader_kwargs={"encoding": "utf-8", "autodetect_encoding": True}
    )
    documentos = loader.load()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=400,
        chunk_overlap=50
    )
    chunks = splitter.split_documents(documentos)

    embeddings = GoogleGenerativeAIEmbeddings(
        google_api_key=os.getenv("GOOGLE_API_KEY"),
        model="models/gemini-embedding-001",
        task_type="RETRIEVAL_DOCUMENT"
    )
    
    teste = embeddings.embed_query("Seguro auto com cobertura de colisão")
    
    st.write("Embedding gerado com sucesso:", len(teste))
    st.write(f"Qtd. documentos carregados: {len(documentos)}")
    st.write(f"Qtd. chunks gerados: {len(chunks)}")
    st.write("Primeiro chunk:", chunks[0].page_content[:300] if chunks else "Nenhum chunk")
    
    teste_chunks = chunks[:10]

    db = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory="chroma_db"
    )

    retriever = db.as_retriever(search_kwargs={"k": 3})

    llm = ChatGoogleGenerativeAI(
        google_api_key=os.getenv("GOOGLE_API_KEY"),
        model="gemini-2.0-flash",
        temperature=0.2
    )

    memory = ConversationBufferMemory(
        memory_key="chat_history",
        return_messages=True,
        output_key="answer"
    )

    qa = ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=retriever,
        memory=memory,
        return_source_documents=True,
        combine_docs_chain_kwargs={"prompt": QA_PROMPT}
    )
    return qa

# --- LOG DE INTERAÇÕES ---
def logar_interacao(pergunta: str, resposta: str):
    os.makedirs("logs", exist_ok=True)
    with open("logs/interacoes.csv", "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([datetime.now().isoformat(), pergunta, resposta[:200]])

# --- INTERFACE ---
st.markdown('<div class="header-bar"></div>', unsafe_allow_html=True)

st.title("🛡️ SegurAI Assistente")
st.caption("Atendimento inicial para segurados · InsurTech Minds")

st.markdown("""
<div class="status-badge">
    <span class="status-dot"></span>
    Consultoria Inteligente Ativa
</div>
""", unsafe_allow_html=True)

st.info(
    "Este chatbot responde dúvidas gerais sobre seguros. "
    "As respostas **não substituem** a análise oficial da seguradora ou corretora."
)

with st.sidebar:
    st.markdown("## InsurTech Minds")
    st.markdown("Assistente de atendimento para **Seguro Auto** e **Residencial**.")
    st.divider()
    st.markdown("**Perguntas sugeridas:**")
    st.markdown("""
- Meu carro foi roubado, o que devo fazer?
- O seguro cobre colisão?
- Como emitir segunda via do boleto?
- O que é franquia?
- Quando devo falar com atendimento humano?
- O seguro residencial cobre enchente?
    """)
    st.divider()
    if st.button("🗑️ Limpar histórico"):
        st.session_state.messages = []
        st.rerun()
    st.markdown("""
<div style="margin-top: 2rem; font-size: 0.7rem; opacity: 0.5; letter-spacing: 0.08em; text-transform: uppercase;">
    © 2024 SegurAI<br>Tecnologia de precisão em seguros.
</div>
""", unsafe_allow_html=True)

if "messages" not in st.session_state:
    st.session_state.messages = []

for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])
        if message.get("sources"):
            with st.expander("📄 Fontes consultadas"):
                for src in message["sources"]:
                    st.caption(f"• {src}")

try:
    qa = carregar_rag()
except Exception as e:
    st.error("Erro ao carregar o chatbot. Verifique se a pasta `docs/` existe com arquivos `.txt` e se a chave da API está configurada no `.env`.")
    st.code(str(e))
    st.stop()

if prompt := st.chat_input("Digite sua dúvida sobre seguro..."):
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    with st.chat_message("assistant"):
        with st.spinner("Consultando a base de conhecimento..."):
            resultado = qa.invoke({"question": prompt})

        resposta = resultado["answer"]
        fontes = list({
            doc.metadata.get("source", "Documento interno")
            for doc in resultado.get("source_documents", [])
        })

        st.markdown(resposta)
        if fontes:
            with st.expander("📄 Fontes consultadas"):
                for src in fontes:
                    st.caption(f"• {src}")

        logar_interacao(prompt, resposta)

    st.session_state.messages.append({
        "role": "assistant",
        "content": resposta,
        "sources": fontes
    })

st.markdown(
    """
    <div class="footer-text">
        Respostas baseadas em condições contratuais genéricas · Sempre consulte sua apólice oficial
    </div>
    """,
    unsafe_allow_html=True
)
