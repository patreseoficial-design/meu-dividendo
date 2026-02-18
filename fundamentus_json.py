from pyFundamentus.fundamentus import get_result
import json

# ============================
# Pega todos os dados do Fundamentus
# ============================
df = get_result()

# ============================
# Ajusta nomes das colunas para combinar com HTML
# ============================
df = df.rename(columns={
    'Ticker': 'Ticker',
    'P/L': 'P/L',
    'P/VP': 'P/VP',
    'Div/Yield': 'Dividend Yield',  # dependendo do pyFundamentus pode vir como 'Div/Yield' ou 'DivYld'
    'ROE': 'ROE',
    'Preco': 'Preco'
})

# Garante que todos os tickers fiquem em maiúsculas
df['Ticker'] = df['Ticker'].str.upper()

# ============================
# Salva JSON pronto para o HTML
# ============================
df.to_json("fundamentus.json", orient="records", force_ascii=False)
print("✅ JSON fundamentus.json gerado com sucesso!")