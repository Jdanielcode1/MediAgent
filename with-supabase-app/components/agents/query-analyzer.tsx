"use client";

import { useState, useEffect } from "react";
import { LeadGenerationService } from "@/services/lead-generation-service";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface QueryAnalyzerProps {
  query: string;
  isSearching: boolean;
}

export default function QueryAnalyzer({ query, isSearching }: QueryAnalyzerProps) {
  const [parsedData, setParsedData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const leadService = new LeadGenerationService();
  
  useEffect(() => {
    const analyzeQuery = async () => {
      if (!query.trim() || !isSearching) return;
      
      setIsAnalyzing(true);
      try {
        const data = await leadService.parseQueryWithNLP(query);
        setParsedData(data);
      } catch (error) {
        console.error("Error analyzing query:", error);
      } finally {
        setIsAnalyzing(false);
      }
    };
    
    analyzeQuery();
  }, [query, isSearching]);
  
  if (!isSearching || !parsedData) return null;
  
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Query Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {parsedData.titles.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-1">Job Titles</h4>
              <div className="flex flex-wrap gap-1">
                {parsedData.titles.map((title: string, index: number) => (
                  <Badge key={index} variant="outline">{title}</Badge>
                ))}
              </div>
            </div>
          )}
          
          {parsedData.industries.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-1">Industries</h4>
              <div className="flex flex-wrap gap-1">
                {parsedData.industries.map((industry: string, index: number) => (
                  <Badge key={index} variant="outline">{industry}</Badge>
                ))}
              </div>
            </div>
          )}
          
          {parsedData.specialties.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-1">Medical Specialties</h4>
              <div className="flex flex-wrap gap-1">
                {parsedData.specialties.map((specialty: string, index: number) => (
                  <Badge key={index} variant="outline">{specialty}</Badge>
                ))}
              </div>
            </div>
          )}
          
          {parsedData.painPoints.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-1">Pain Points</h4>
              <div className="flex flex-wrap gap-1">
                {parsedData.painPoints.map((point: string, index: number) => (
                  <Badge key={index} variant="outline">{point}</Badge>
                ))}
              </div>
            </div>
          )}
          
          {parsedData.location && (
            <div>
              <h4 className="text-sm font-medium mb-1">Location</h4>
              <Badge variant="outline">{parsedData.location}</Badge>
            </div>
          )}
          
          {parsedData.companySize && (
            <div>
              <h4 className="text-sm font-medium mb-1">Company Size</h4>
              <Badge variant="outline">{parsedData.companySize}</Badge>
            </div>
          )}
          
          {parsedData.budgetInfo && (
            <div>
              <h4 className="text-sm font-medium mb-1">Budget Information</h4>
              <Badge variant="outline">{parsedData.budgetInfo}</Badge>
            </div>
          )}
          
          {parsedData.timeframe && (
            <div>
              <h4 className="text-sm font-medium mb-1">Timeframe</h4>
              <Badge variant="outline">{parsedData.timeframe}</Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}