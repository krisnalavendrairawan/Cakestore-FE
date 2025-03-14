import React from 'react';
import { Button } from "@/components/ui/button";

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-pink-200 py-16 border-t">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Visit Our Bakery</h2>
            <p className="text-gray-600 mb-4">
              123 Sweet Street<br />
              Cake City, CC 12345
            </p>
            <p className="text-gray-600 mb-4">
              Monday - Saturday: 8AM - 8PM<br />
              Sunday: 9AM - 6PM
            </p>
            <Button className="bg-pink-600 hover:bg-pink-700">
              Get Directions
            </Button>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
            <p className="text-gray-600 mb-4">
              Phone: (555) 123-4567<br />
              Email: hello@sweetdelights.com
            </p>
            <div className="flex gap-4">
              <Button variant="outline" className="border-pink-600 text-pink-600 hover:bg-pink-50">
                Call Now
              </Button>
              <Button variant="outline" className="border-pink-600 text-pink-600 hover:bg-pink-50">
                Send Email
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;