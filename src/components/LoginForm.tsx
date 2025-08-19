import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const LoginForm: React.FC = () => {
  const { login, loading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      // Error is handled by the auth context
    }
  };

  return (
    <Container>
      <LoginCard>
        <Title>Restaurant Manager</Title>
        <Subtitle>Please sign in to continue</Subtitle>
        
        {error && (
          <ErrorMessage onClick={clearError}>
            {error}
          </ErrorMessage>
        )}
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </FormGroup>
          
          <LoginButton type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </LoginButton>
        </Form>
        
        <DemoInfo>
          <h4>Demo Credentials:</h4>
          <p><strong>Admin:</strong> admin@restaurant.com / password123</p>
          <p><strong>Manager:</strong> manager@restaurant.com / password123</p>
          <p><strong>Staff:</strong> staff@restaurant.com / password123</p>
        </DemoInfo>
      </LoginCard>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  text-align: center;
  color: #1e293b;
  margin-bottom: 0.5rem;
  font-size: 1.75rem;
  font-weight: 700;
`;

const Subtitle = styled.p`
  text-align: center;
  color: #64748b;
  margin-bottom: 2rem;
  font-size: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #06b6d4;
    box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
  }
`;

const LoginButton = styled.button`
  background: #06b6d4;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover:not(:disabled) {
    background: #0891b2;
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background: #fef2f2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #fecaca;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  
  &:hover {
    background: #fee2e2;
  }
`;

const DemoInfo = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  
  h4 {
    margin: 0 0 0.5rem 0;
    color: #1e293b;
    font-size: 0.875rem;
  }
  
  p {
    margin: 0.25rem 0;
    font-size: 0.75rem;
    color: #64748b;
  }
`;

export default LoginForm;
