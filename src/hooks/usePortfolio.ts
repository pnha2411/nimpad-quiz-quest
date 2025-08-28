import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Portfolio {
  id: string;
  name: string;
  template_type: string;
  risk_score: number;
  allocations: Record<string, number>;
  deployed_txs: Record<string, any>;
  total_value: number;
  status: 'draft' | 'active' | 'paused';
  created_at: string;
  updated_at: string;
}

export interface Protocol {
  id: string;
  name: string;
  protocol_type: string;
  chain: string;
  description: string;
  apy_current: number;
  tvl: number;
  risk_rating: number;
  is_active: boolean;
  metadata: Record<string, any>;
}

export interface RiskProfile {
  id?: string;
  user_id: string;
  experience_level: 'beginner' | 'intermediate' | 'advanced';
  risk_tolerance: number;
  investment_timeline: 'short' | 'medium' | 'long';
  jurisdiction?: string;
  kyc_status: 'pending' | 'verified' | 'rejected';
  assessment_data: Record<string, any>;
}

export const usePortfolio = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [riskProfile, setRiskProfile] = useState<RiskProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch user's portfolios
  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const portfolios = (data || []).map(item => ({
        ...item,
        allocations: (item.allocations as any) || {},
        deployed_txs: (item.deployed_txs as any) || {},
        status: item.status as 'draft' | 'active' | 'paused'
      }));
      
      setPortfolios(portfolios);
    } catch (error) {
      console.error('Error fetching portfolios:', error);
      toast({
        title: "Error",
        description: "Failed to fetch portfolios",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch available protocols
  const fetchProtocols = async () => {
    try {
      const { data, error } = await supabase
        .from('protocols')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      
      const protocols = (data || []).map(item => ({
        ...item,
        metadata: (item.metadata as any) || {}
      }));
      
      setProtocols(protocols);
    } catch (error) {
      console.error('Error fetching protocols:', error);
    }
  };

  // Fetch user's risk profile
  const fetchRiskProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('risk_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        const profile = {
          ...data,
          experience_level: data.experience_level as 'beginner' | 'intermediate' | 'advanced',
          investment_timeline: data.investment_timeline as 'short' | 'medium' | 'long',
          kyc_status: data.kyc_status as 'pending' | 'verified' | 'rejected',
          assessment_data: (data.assessment_data as any) || {}
        };
        setRiskProfile(profile);
      }
    } catch (error) {
      console.error('Error fetching risk profile:', error);
    }
  };

  // Create a new portfolio
  const createPortfolio = async (portfolioData: Partial<Portfolio>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const insertData = {
        name: portfolioData.name || 'New Portfolio',
        template_type: portfolioData.template_type || 'custom',
        risk_score: portfolioData.risk_score || 5,
        allocations: portfolioData.allocations || {},
        deployed_txs: portfolioData.deployed_txs || {},
        total_value: portfolioData.total_value || 0,
        status: portfolioData.status || 'draft',
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('portfolios')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      const portfolio = {
        ...data,
        allocations: (data.allocations as any) || {},
        deployed_txs: (data.deployed_txs as any) || {},
        status: data.status as 'draft' | 'active' | 'paused'
      };

      setPortfolios(prev => [portfolio, ...prev]);
      toast({
        title: "Success",
        description: "Portfolio created successfully",
      });

      return portfolio;
    } catch (error) {
      console.error('Error creating portfolio:', error);
      toast({
        title: "Error",
        description: "Failed to create portfolio",
        variant: "destructive",
      });
      return null;
    }
  };

  // Update risk profile
  const updateRiskProfile = async (profileData: Partial<RiskProfile>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const upsertData = {
        user_id: user.id,
        experience_level: profileData.experience_level || 'beginner',
        risk_tolerance: profileData.risk_tolerance || 5,
        investment_timeline: profileData.investment_timeline || 'medium',
        jurisdiction: profileData.jurisdiction,
        kyc_status: profileData.kyc_status || 'pending',
        assessment_data: profileData.assessment_data || {}
      };

      const { data, error } = await supabase
        .from('risk_profiles')
        .upsert(upsertData)
        .select()
        .single();

      if (error) throw error;

      const profile = {
        ...data,
        experience_level: data.experience_level as 'beginner' | 'intermediate' | 'advanced',
        investment_timeline: data.investment_timeline as 'short' | 'medium' | 'long',
        kyc_status: data.kyc_status as 'pending' | 'verified' | 'rejected',
        assessment_data: (data.assessment_data as any) || {}
      };

      setRiskProfile(profile);
      toast({
        title: "Success",
        description: "Risk profile updated successfully",
      });

      return profile;
    } catch (error) {
      console.error('Error updating risk profile:', error);
      toast({
        title: "Error",
        description: "Failed to update risk profile",
        variant: "destructive",
      });
      return null;
    }
  };

  // Get portfolio recommendations based on risk profile - Updated for CoreDAO
  const getPortfolioRecommendations = (riskScore: number) => {
    const recommendations = {
      conservative: {
        allocations: {
          'Colend': 50,
          'Core Staking': 35,
          'SolvBTC': 15
        },
        description: 'Conservative allocation focusing on stable CoreDAO yields'
      },
      balanced: {
        allocations: {
          'Colend': 30,
          'Core Staking': 25,
          'BIMA': 20,
          'NLX': 15,
          'SolvBTC': 10
        },
        description: 'Balanced CoreDAO DeFi approach with moderate risk and returns'
      },
      aggressive: {
        allocations: {
          'BIMA': 35,
          'Glyph Exchange': 25,
          'NLX': 20,
          'Core Staking': 20
        },
        description: 'Higher risk CoreDAO DeFi allocation for maximum potential returns'
      }
    };

    if (riskScore <= 3) return recommendations.conservative;
    if (riskScore <= 7) return recommendations.balanced;
    return recommendations.aggressive;
  };

  useEffect(() => {
    fetchPortfolios();
    fetchProtocols();
    fetchRiskProfile();
  }, []);

  return {
    portfolios,
    protocols,
    riskProfile,
    loading,
    fetchPortfolios,
    createPortfolio,
    updateRiskProfile,
    getPortfolioRecommendations,
  };
};