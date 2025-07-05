-- Add BTCFi Builder tables while keeping existing Nimpad functionality

-- Portfolio management
CREATE TABLE public.portfolios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  template_type TEXT NOT NULL DEFAULT 'custom',
  risk_score INTEGER NOT NULL DEFAULT 5,
  allocations JSONB NOT NULL DEFAULT '{}',
  deployed_txs JSONB DEFAULT '{}',
  total_value DECIMAL(20,8) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Alerts system
CREATE TABLE public.alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL,
  threshold DECIMAL(20,8),
  condition TEXT NOT NULL DEFAULT 'above',
  is_active BOOLEAN NOT NULL DEFAULT true,
  message TEXT,
  triggered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Reports
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  report_type TEXT NOT NULL DEFAULT 'daily',
  data JSONB NOT NULL DEFAULT '{}',
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Risk profiles (extends existing profile functionality)
CREATE TABLE public.risk_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  experience_level TEXT NOT NULL DEFAULT 'beginner',
  risk_tolerance INTEGER NOT NULL DEFAULT 5,
  investment_timeline TEXT NOT NULL DEFAULT 'medium',
  jurisdiction TEXT,
  kyc_status TEXT NOT NULL DEFAULT 'pending',
  assessment_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- BTCFi protocols tracking
CREATE TABLE public.protocols (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  protocol_type TEXT NOT NULL,
  chain TEXT NOT NULL,
  description TEXT,
  apy_current DECIMAL(8,4),
  tvl DECIMAL(20,8),
  risk_rating INTEGER DEFAULT 5,
  is_active BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.protocols ENABLE ROW LEVEL SECURITY;

-- RLS Policies for portfolios
CREATE POLICY "Users can manage their own portfolios" 
ON public.portfolios 
FOR ALL 
USING (auth.uid()::text = user_id::text);

-- RLS Policies for alerts
CREATE POLICY "Users can manage their own alerts" 
ON public.alerts 
FOR ALL 
USING (auth.uid()::text = user_id::text);

-- RLS Policies for reports
CREATE POLICY "Users can view their own reports" 
ON public.reports 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "System can insert reports" 
ON public.reports 
FOR INSERT 
WITH CHECK (true);

-- RLS Policies for risk profiles
CREATE POLICY "Users can manage their own risk profile" 
ON public.risk_profiles 
FOR ALL 
USING (auth.uid()::text = user_id::text);

-- RLS Policies for protocols (public read)
CREATE POLICY "Protocols are viewable by everyone" 
ON public.protocols 
FOR SELECT 
USING (true);

-- Insert sample BTCFi protocols
INSERT INTO public.protocols (name, protocol_type, chain, description, apy_current, tvl, risk_rating) VALUES
('Babylon Staking', 'staking', 'bitcoin', 'Bitcoin staking through Babylon protocol', 8.5, 1500000, 3),
('Lightning Pool', 'liquidity', 'lightning', 'Lightning Network liquidity provision', 12.3, 850000, 4),
('Stacks DeFi', 'defi', 'stacks', 'DeFi protocols on Stacks Bitcoin L2', 15.7, 2300000, 5),
('Rootstock Bridge', 'bridge', 'rootstock', 'Cross-chain Bitcoin DeFi on Rootstock', 10.2, 1200000, 4);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for timestamp updates
CREATE TRIGGER update_portfolios_updated_at
    BEFORE UPDATE ON public.portfolios
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_risk_profiles_updated_at
    BEFORE UPDATE ON public.risk_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_protocols_updated_at
    BEFORE UPDATE ON public.protocols
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();