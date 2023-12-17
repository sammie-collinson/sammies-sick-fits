import styled from 'styled-components';
import React from 'react';
import { isApolloError } from '@apollo/client';

const ErrorStyles = styled.div`
  padding: 2rem;
  background: white;
  margin: 2rem 0;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-left: 5px solid red;
  p {
    margin: 0;
    font-weight: 100;
  }
  strong {
    margin-right: 1rem;
  }
`;

interface DisplayErrorProps {
  error: {
    [key: string]: string;
  };
}

const DisplayError = ({ error }: DisplayErrorProps) => {
  if (!error) return null;

  if (!error.message) {
    const errorMessage = JSON.stringify(error);
    return (
      <ErrorStyles>
        <p data-test="graphql-error">
          <strong>Shoot!</strong>
          {errorMessage.replace('GraphQL error: ', '')}
        </p>
      </ErrorStyles>
    );
  }

  return (
    <ErrorStyles>
      <p data-test="graphql-error">
        <strong>Shoot!</strong>
        {error.message.replace('GraphQL error: ', '')}
      </p>
    </ErrorStyles>
  );
};

export default DisplayError;
