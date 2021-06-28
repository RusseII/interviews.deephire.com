import useSWR from 'swr';
import fetcher from './fetcher';
import { lowerCaseQueryParams } from '@/services/helpers';


export const useCompany = id => {
  const { data, error, mutate } = useSWR( id ? [`/v1/companies/${id}`] : null, fetcher);
  return {
    data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

export const useInterview = () => {
  const { id } = lowerCaseQueryParams(window.location.search);

  const { data, error, mutate } = useSWR( id ? [`/v1/interviews/${id}`] : null, fetcher);
  return {
    data: data?.[0] || data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};