import { CampaignState, CampaignAction, campaignInitialState } from "@/reducers/campaign.reducer";
import React, { useContext } from "react";

export const CampaignContext = React.createContext<{
  state?: CampaignState,
  dispatch: React.Dispatch<CampaignAction>
}>({
  state: campaignInitialState,
  dispatch: () => {}
})

export const CampaignProvider = CampaignContext.Provider;
export const useCampaign = () => useContext(CampaignContext)