import React from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';

// Simple test component to validate Seijaku animations
function SeijkuTest() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Seijaku Animation Test</h1>
      
      <div className="grid grid-cols-2 gap-4">
        <Card className="seijaku-float">
          <CardHeader>
            <CardTitle>Floating Card</CardTitle>
            <CardDescription>This card should float gently</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Content with zen-like floating motion</p>
          </CardContent>
        </Card>
        
        <Card className="seijaku-breathe">
          <CardHeader>
            <CardTitle>Breathing Card</CardTitle>
            <CardDescription>This card should breathe tranquilly</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Content with breathing animation</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-3">
        <Button className="seijaku-interactive seijaku-glow">Interactive Button</Button>
        <Button variant="outline" className="seijaku-hover-lift">Hover Lift Button</Button>
        <Button variant="secondary" className="seijaku-transition">Smooth Transition</Button>
      </div>
      
      <div className="bg-accent/5 p-4 rounded-lg seijaku-pulse-wabi">
        <p>This element has a wabi-sabi inspired pulse animation</p>
      </div>
    </div>
  );
}

export default SeijkuTest;