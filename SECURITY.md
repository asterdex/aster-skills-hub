# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| main (latest) | Yes |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly:

1. **Do NOT open a public GitHub issue** for security vulnerabilities.
2. Email your report to the repository maintainers with:
   - Description of the vulnerability
   - Steps to reproduce
   - Affected files and severity assessment
   - Suggested fix (if any)
3. You will receive an acknowledgment within 48 hours.
4. A fix will be prioritized based on severity (critical/high within 7 days).

## Security Scope

This project handles **real funds on EVM chains** (Ethereum, BSC, Arbitrum). The following areas are security-critical:

### Private Key Management
- Private keys must only be loaded from environment variables (`ASTER_DEPOSIT_PRIVATE_KEY`)
- Keys are validated (0x + 64 hex characters) and removed from `process.env` after use
- Error output is sanitized to prevent accidental key leakage in logs
- `balance.mjs` never loads private keys (read-only operations use public addresses only)

### Deposit Address Validation
- Deposit addresses fetched from the API are validated against a hardcoded whitelist in `common.mjs`
- This prevents oracle attacks (DNS hijack, BGP hijack, API compromise)
- Operators must populate `TREASURY_WHITELIST` with official Aster addresses before production use

### Transaction Safety
- All transactions include an explicit gas limit to prevent gas drain
- Balance is verified before submitting deposit transactions
- Per-chain confirmation counts protect against block reorganizations (ETH=2, BSC=3, Arbitrum=2)
- The `SKILL.md` mandates explicit user confirmation before any deposit

### RPC Security
- Public RPCs are for development/testing only
- Production deployments must use authenticated private RPCs (Alchemy, Infura, private nodes)
- A warning is emitted when public RPCs are used as fallback

## Environment Variables

See `.env.example` for all required and optional environment variables. Never commit `.env` files to version control.

## Audit History

| Date | Scope | Findings | Status |
|------|-------|----------|--------|
| March 2026 | Full repo audit | 12 vulnerabilities (2 critical, 1 high, 4 medium, 5 low) | All fixed |

See `SECURITY-CHANGELOG.md` for detailed fix documentation.
