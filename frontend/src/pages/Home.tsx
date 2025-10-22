import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-[420px] text-center shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Welcome Home!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">You are successfully logged in 🎉</p>
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;