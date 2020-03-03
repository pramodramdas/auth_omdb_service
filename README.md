# auth_omdb_service

wget https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.9.8/kubeseal-linux-amd64 -O kubeseal

sudo install -m 755 kubeseal /usr/local/bin/kubeseal

kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.9.8/controller.yaml

kubeseal --format yaml < postgres-env-secrets.yml > po.yaml

or
kubeseal --fetch-cert > mycert.pem
kubeseal --format=yaml --cert=pub-cert.pem < postgres-env-secrets.yml > po.yaml
