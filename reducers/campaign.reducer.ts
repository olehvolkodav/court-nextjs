import { isObject } from "@/utils/object";
import React from "react"

export const campaignInitialState = {
  campaign: {
    name: '',
    purpose: 'automation',
    description: null,
  } as Record<string, any>,
  step: 'campaign',
  sequences: [] as any[],
  recipients: [] as any[],
  tags: [] as any[],
}

export type CampaignState = ReturnType<() => typeof campaignInitialState>

export interface CampaignAction {
  type: 'step' | 'campaign' | 'tags' | 'recipients' | 'sequences',
  value?: any;
}

export const campaignReducer: React.Reducer<CampaignState, CampaignAction> = (state, action) => {
  if (action.type === 'step') {
    return {
      ...state,
      step: action.value,
    }
  }

  if (action.type === 'campaign') {
    return {
      ...state,
      campaign: {
        ...state.campaign,
        ...action.value
      },
    }
  }

  const addOrFilterState = (prop: 'sequences' | 'recipients' | 'tags') => {
    if (isObject(action.value)) {
      if (['tags', 'recipients'].includes(prop) && !!state[prop].find(o => o.id == action.value.id)) {
        return state[prop];
      }

      return [...state[prop], {
        ...action.value,
        timestamp: Date.now()
      }]
    }

    return state[prop].filter(prev => {
      if (['recipients', 'tags'].includes(prop)) {
        return prev.id != action.value
      }

      return prev.timestamp != action.value;
    });
  }

  if (['sequences', 'recipients', 'tags'].includes(action.type)) {
    return {
      ...state,
      [action.type]: addOrFilterState(action.type as any)
    }
  }

  return state;
}
