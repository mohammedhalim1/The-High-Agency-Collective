import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2, Send, CheckCircle } from 'lucide-react';

const FormspreeTest = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultFormspreeUrl = "https://formspree.io/f/xvgqqrdl";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      console.log('🚀 Testing Formspree submission:', {
        url: defaultFormspreeUrl,
        data: formData
      });

      const response = await fetch(defaultFormspreeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('📨 Formspree response:', response.status, response.statusText);

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
      } else {
        const errorText = await response.text();
        throw new Error(`Form submission failed: ${response.status} - ${errorText}`);
      }
    } catch (err: any) {
      console.error('❌ Formspree error:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (submitted) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-8">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Message Sent!</h3>
          <p className="text-gray-600 mb-4">Your test message was successfully sent via Formspree.</p>
          <Button onClick={() => setSubmitted(false)} variant="outline">
            Send Another Test
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Formspree Test Form
        </CardTitle>
        <p className="text-sm text-gray-600">
          Test the Formspree integration: {defaultFormspreeUrl}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="test-name" className="block text-sm font-medium mb-1">
              Name
            </label>
            <Input
              id="test-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label htmlFor="test-email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <Input
              id="test-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="test-message" className="block text-sm font-medium mb-1">
              Message
            </label>
            <Textarea
              id="test-message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Enter your test message"
              rows={4}
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isSubmitting ? 'Sending...' : 'Send Test Message'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FormspreeTest;
