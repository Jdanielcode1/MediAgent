import { Linkedin, Search } from "lucide-react";

export default function SearchResults() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
          <span className="text-sm">🔍</span>
        </div>
        
        <div className="flex-1">
          <p className="text-lg mb-4">Searching for your ideal leads based on input...</p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <Linkedin className="text-blue-600" size={24} />
              <span className="font-medium">Finding wound care specialists & nursing directors in LinkedIn...</span>
            </div>
            
            <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center justify-center w-6 h-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              </div>
              <span className="font-medium">Mapping Medicare-certified facilities in your area...</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-start gap-4 mt-8">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
          <span className="text-sm">💡</span>
        </div>
        
        <div className="flex-1 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-gray-700">
            Looking for wound care centers and home health agencies managing at least 50 chronic wound 
            patients monthly, still using manual tracking systems and struggling with measurement accuracy. 
            Focus on Medicare-certified facilities where Wound Care Specialists or Nursing Directors report 
            staff shortages and documentation issues. Our smart wound monitoring system costs $5-15K and 
            delivers 40% time savings plus 30% better healing outcomes. Best opportunities are facilities 
            frustrated with slow measurements, missed early infections, and compliance documentation 
            challenges. Target facilities must have budget authority and be open to new digital health solutions.
          </p>
        </div>
      </div>
    </div>
  );
}