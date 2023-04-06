import { gql, useQuery } from "@apollo/client";
import { VOICE_MEMO } from "../query/voice";

export const useVoiceMemoQuery = () => {
  const { data, loading, refetch } = useQuery(
    gql`
      ${VOICE_MEMO}
    `
  );
  return{
    all_voiceMemos: data,
    loading: loading,
    refetch: refetch
  }
};
