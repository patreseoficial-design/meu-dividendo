from pyFundamentus.fundamentus import get_result
import json

df = get_result()
dados_json = df.to_dict(orient="records")

with open("fundamentus.json", "w") as f:
    json.dump(dados_json, f, indent=2)

print("JSON gerado com sucesso!")