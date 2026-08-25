# Security Boundary

Sky Design Tokens is an engineering-beta local library. It does not authenticate users, store secrets, fetch remote themes, execute user code, or provide a network service.

Treat token files as application configuration. Do not place credentials, API keys, private user data, or other secrets in design-token names, descriptions, or values. Consumers that load tokens from untrusted sources should enforce their own file-size, transport, authorization, provenance, and content policies before calling this package.

The resolver accepts only strings and finite numbers and bounds token/name/description sizes. It does not sanitize token values for HTML, CSS, shell, SQL, or other downstream contexts; consumers must escape values appropriately at the point of use.

CI verifies compilation, deterministic tests, dependency audit, and package creation. These checks are not a security or accessibility certification.
