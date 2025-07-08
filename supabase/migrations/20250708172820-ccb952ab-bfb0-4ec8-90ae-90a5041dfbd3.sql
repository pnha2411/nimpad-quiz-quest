-- Insert CoreDAO protocols for portfolio builder
INSERT INTO protocols (name, protocol_type, chain, description, apy_current, tvl, risk_rating, is_active, metadata)
VALUES 
  ('Colend', 'lending', 'Core', 'Decentralized lending platform for Bitcoin-backed loans on CoreDAO', 8.5, 15000000, 3, true, '{"website": "https://colend.core.finance", "audit_status": "audited"}'),
  ('NLX', 'dex', 'Core', 'Native DEX with automated market making and liquidity incentives', 12.3, 8500000, 4, true, '{"website": "https://nlx.finance", "audit_status": "audited"}'),
  ('BIMA', 'yield_vault', 'Core', 'High-yield BTC vault with advanced yield optimization strategies', 15.2, 5200000, 6, true, '{"website": "https://bima.finance", "audit_status": "audited"}'),
  ('SolvBTC', 'liquid_staking', 'Core', 'Liquid staking protocol for Bitcoin with instant liquidity', 9.8, 12000000, 3, true, '{"website": "https://solvbtc.com", "audit_status": "audited"}'),
  ('Glyph Exchange', 'cross_chain_dex', 'Core', 'Cross-chain DEX connecting EVM liquidity with Bitcoin DeFi', 14.7, 6800000, 5, true, '{"website": "https://glyph.exchange", "audit_status": "audited"}'),
  ('Core Staking', 'staking', 'Core', 'Native CORE token staking with dual staking rewards', 12.0, 45000000, 2, true, '{"website": "https://stake.coredao.org", "audit_status": "official"}')
ON CONFLICT (name) DO UPDATE SET
  protocol_type = EXCLUDED.protocol_type,
  chain = EXCLUDED.chain,
  description = EXCLUDED.description,
  apy_current = EXCLUDED.apy_current,
  tvl = EXCLUDED.tvl,
  risk_rating = EXCLUDED.risk_rating,
  is_active = EXCLUDED.is_active,
  metadata = EXCLUDED.metadata,
  updated_at = now();