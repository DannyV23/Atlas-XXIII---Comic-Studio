import { useCallback, useState } from 'react';
import { hasValidApiKey } from './geminiService';

export const useApiKey = () => {
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);

  const validateApiKey = useCallback(async (): Promise<boolean> => {
    if (!hasValidApiKey()) {
      setShowApiKeyDialog(true);
      return false;
    }
    return true;
  }, []);

  const openApiKeyDialog = useCallback(() => {
    setShowApiKeyDialog(true);
  }, []);

  const handleApiKeyDialogContinue = useCallback(async () => {
    setShowApiKeyDialog(false);
  }, []);

  return {
    showApiKeyDialog,
    setShowApiKeyDialog,
    openApiKeyDialog,
    validateApiKey,
    handleApiKeyDialogContinue,
  };
};
