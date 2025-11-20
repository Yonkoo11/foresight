/**
 * Optimistic Write Hook
 * Provides optimistic UI updates for contract write operations
 * Updates UI immediately before blockchain confirmation
 */

import { useState, useCallback, useEffect, useRef } from 'react';

export interface OptimisticState<T = any> {
  // Current optimistic data (shown in UI immediately)
  optimisticData: T | null;
  // Whether a transaction is pending
  isPending: boolean;
  // Whether transaction is confirming on blockchain
  isConfirming: boolean;
  // Whether confirmed successfully
  isSuccess: boolean;
  // Error if transaction failed
  error: Error | null;
  // Transaction hash
  hash: string | null;
}

export interface OptimisticWriteOptions<T> {
  // Function to call when transaction succeeds
  onSuccess?: (data: T) => void;
  // Function to call when transaction fails
  onError?: (error: Error) => void;
  // Function to call to refetch real data after success
  refetch?: () => void | Promise<void>;
  // How long to show optimistic data before reverting (if no confirmation)
  timeout?: number;
}

/**
 * Hook for optimistic contract writes
 * Shows immediate UI feedback while transaction confirms
 */
export function useOptimisticWrite<T = any>(
  options: OptimisticWriteOptions<T> = {}
) {
  const { onSuccess, onError, refetch, timeout = 30000 } = options;

  const [state, setState] = useState<OptimisticState<T>>({
    optimisticData: null,
    isPending: false,
    isConfirming: false,
    isSuccess: false,
    error: null,
    hash: null,
  });

  const timeoutRef = useRef<NodeJS.Timeout>();

  // Clear optimistic state
  const clearOptimistic = useCallback(() => {
    setState(prev => ({
      ...prev,
      optimisticData: null,
      isPending: false,
      isConfirming: false,
    }));

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  // Set optimistic data immediately
  const setOptimistic = useCallback((data: T) => {
    setState(prev => ({
      ...prev,
      optimisticData: data,
      isPending: true,
      isConfirming: false,
      isSuccess: false,
      error: null,
      hash: null,
    }));

    // Set timeout to revert optimistic update if transaction doesn't confirm
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setState(prev => {
        if (!prev.isSuccess) {
          return {
            ...prev,
            optimisticData: null,
            isPending: false,
            isConfirming: false,
            error: new Error('Transaction timeout'),
          };
        }
        return prev;
      });
    }, timeout);
  }, [timeout]);

  // Mark transaction as confirming
  const setConfirming = useCallback((hash: string) => {
    setState(prev => ({
      ...prev,
      isPending: false,
      isConfirming: true,
      hash,
    }));
  }, []);

  // Mark transaction as successful
  const setSuccess = useCallback(async (data?: T) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setState(prev => ({
      ...prev,
      isPending: false,
      isConfirming: false,
      isSuccess: true,
      optimisticData: data ?? prev.optimisticData,
    }));

    // Call success callback
    if (onSuccess && (data || state.optimisticData)) {
      onSuccess((data ?? state.optimisticData)!);
    }

    // Refetch real data from contract
    if (refetch) {
      await refetch();
    }

    // Clear optimistic state after successful refetch
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        optimisticData: null,
      }));
    }, 1000);
  }, [onSuccess, refetch, state.optimisticData]);

  // Mark transaction as failed
  const setError = useCallback((error: Error) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setState(prev => ({
      ...prev,
      optimisticData: null,
      isPending: false,
      isConfirming: false,
      isSuccess: false,
      error,
    }));

    // Call error callback
    if (onError) {
      onError(error);
    }
  }, [onError]);

  // Reset all state
  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setState({
      optimisticData: null,
      isPending: false,
      isConfirming: false,
      isSuccess: false,
      error: null,
      hash: null,
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    ...state,
    setOptimistic,
    setConfirming,
    setSuccess,
    setError,
    clearOptimistic,
    reset,
  };
}

/**
 * Loading state component props generator
 * Use this to show loading states in UI
 */
export function getLoadingState(state: OptimisticState) {
  if (state.isPending) {
    return {
      loading: true,
      message: 'Preparing transaction...',
      type: 'pending' as const,
    };
  }

  if (state.isConfirming) {
    return {
      loading: true,
      message: 'Confirming on blockchain...',
      type: 'confirming' as const,
    };
  }

  if (state.isSuccess) {
    return {
      loading: false,
      message: 'Transaction confirmed!',
      type: 'success' as const,
    };
  }

  if (state.error) {
    return {
      loading: false,
      message: state.error.message,
      type: 'error' as const,
    };
  }

  return {
    loading: false,
    message: null,
    type: 'idle' as const,
  };
}
