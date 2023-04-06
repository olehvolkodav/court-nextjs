import { $gql } from "@/plugins/http"
import useSWR from "swr";

const CAMPAIGN_QUERY = `
  query ($id: ID!) {
    campaign: admin_campaign(id: $id) {
      id
      name
      purpose
      status
      sequences_count
      triggers_count
      recipients_count
      sequence {
        id
        template {
          name
        }
      }
    }
  }
`

const TRIGGERS_QUERY = `
  query($campaignId: ID!) {
    campaign_triggers(campaign_id: $campaignId) {
      id
      name
      sequences {
        id
        send_at
        template {
          name
        }
        dates {
          id
          days
          hours
          minutes
        }
      }
    }
  }
`

const SEARCH_TEMPLATES_QUERY = `
  query {
    templates: search_templates {
      id
      name
      subject
    }
  }
`

export const useCampaignSWR = (id?: string) => {
  const { data, error, mutate } = useSWR(id ? `campaign-detail-${id}`: null, async() => {
    try {
      const res = await $gql({
        query: CAMPAIGN_QUERY,
        variables: { id }
      });

      return res.campaign ?? Promise.reject({message: "Campaign not found"});
    } catch (error) {
      return Promise.reject(error)
    }
  }, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });

  const loading = !data && !error;

  return [data, loading, error, mutate] as const;
}

export const useTriggerSWR = (campaignId?: string) => {
  const { data, error, mutate } = useSWR(campaignId ? `campaign-trigger-${campaignId}`: null, async() => {
    return $gql({
      query: TRIGGERS_QUERY,
      variables: { campaignId }
    }).then(data => data.campaign_triggers);
  }, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });

  const loading = !data && !error;

  return [data as any[] ?? [] as any[], loading, error, mutate] as const
}

export const useSearchTemplateSWR = (variables?: Record<string, any>) => {
  const { data, error, mutate } = useSWR(!variables ? null : "search-templates", async() => {
    return $gql({
      query: SEARCH_TEMPLATES_QUERY,
      // variables,
    }).then(data => data.templates);
  }, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });

  const loading = !data && !error;

  return [data as any[] ?? [] as any[], loading, error, mutate] as const
}
