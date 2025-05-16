#!/bin/bash

# Script to generate self-signed SSL certificates for local development

# Create certs directory if it doesn't exist
mkdir -p certs

# Navigate to certs directory
cd certs

echo "Generating self-signed certificates for HTTPS development..."

# Generate a private key
openssl genrsa -out key.pem 2048

# Generate a CSR (Certificate Signing Request)
openssl req -new -key key.pem -out csr.pem -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

# Generate a self-signed certificate valid for 365 days
openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out cert.pem

# Clean up the CSR as it's no longer needed
rm csr.pem

echo "Self-signed certificates generated successfully in the 'certs' directory."
echo "Note: You'll need to add these certificates to your trusted certificates in your browser/OS to avoid security warnings." 