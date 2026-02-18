from pyFundamentus.fundamentus import get_result
import json

df = get_result()

# Renomeia colunas para combinar com HTML
df = df.rename(columns={
    'Div/Yield': 'Dividend Yield',  # ou como estiver no DataFrame
    'Preco': 'Preco',
    'ROE': 'ROE',
    'P/L': 'P/L',
    'P/VP': 'P/VP',
    'Ticker': 'Ticker'
})

# Coloca todos os Tickers em maiúsculo
df['Ticker'] = df['Ticker'].str.upper()

# Salva JSON
df.to_json("fundamentus.json", orient="records", force_ascii=False)
print("JSON gerado!")