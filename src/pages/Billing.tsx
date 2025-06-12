import React from 'react';
import { Check, Star } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { mockPricingPlans } from '../data/mockData';

export default function Billing() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-graphite tracking-tight">
          Billing and Plans
        </h1>
        <p className="text-gray-600 mt-2">
          Choose the perfect plan for your AI visibility needs
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {mockPricingPlans.map((plan) => (
          <Card
            key={plan.name}
            hover
            className={`relative p-8 ${
              plan.recommended
                ? 'ring-2 ring-primary border-primary/20'
                : ''
            }`}
          >
            {plan.recommended && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-primary text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                  <Star className="h-3 w-3" />
                  <span>Recommended</span>
                </div>
              </div>
            )}

            <div className="text-center">
              <h3 className="text-xl font-semibold text-graphite">
                {plan.name}
              </h3>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-bold text-graphite">
                  £{plan.price}
                </span>
                <span className="text-gray-600">/{plan.period}</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              variant={plan.recommended ? 'primary' : 'secondary'}
              className="w-full"
            >
              {plan.price === 0 ? 'Get Started' : 'Upgrade'}
            </Button>
          </Card>
        ))}
      </div>

      {/* RevenueCat Badge */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-full">
          <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
          <span className="text-sm text-gray-600">
            Powered by RevenueCat
          </span>
        </div>
      </div>

      {/* Usage Overview */}
      <Card className="max-w-2xl mx-auto">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-graphite mb-4">
            Current Usage
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Keywords tracked</span>
              <span className="text-sm font-medium text-graphite">5 / 5</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '100%' }}></div>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-600">Crawls this month</span>
              <span className="text-sm font-medium text-graphite">142 / 200</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-success h-2 rounded-full" style={{ width: '71%' }}></div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}