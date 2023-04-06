// not sure with this hook name

import { useCallback, useState } from "react"

export const useTagsButton = () => {
  const [tags, setTags] = useState<string[]>([]);

  const isTagSelected = useCallback((option: string) => {
    return tags.includes(option);
  }, [tags]);

  const handleTagChange = (option: string) => () => {
    setTags(prev => {
      if (prev.includes(option)) {
        return prev.filter(prevTag => prevTag !== option);
      }

      return [...prev, option];
    })
  }

  return {
    tags,
    isTagSelected,
    handleTagChange
  }
}
