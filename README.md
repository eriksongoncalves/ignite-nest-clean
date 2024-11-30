Generating `private key`

```
openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048
```

Generating `public key`

```
openssl rsa -pubout -in private_key.pem -out public_key.pem
```

Converting `private key` to base64

```
base64 -i private_key.pem -o private_key_base64.txtbas
```

Converting `public key` to base64

```
base64 -i public_key.pem -o public_key_base64.txtbas
```
