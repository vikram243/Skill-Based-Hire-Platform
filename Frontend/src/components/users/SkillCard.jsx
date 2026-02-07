import React from 'react';
import { Card } from '../ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Star, MapPin, Clock, CheckCircle, MessageCircle } from 'lucide-react';

export default function SkillCard({ provider, onClick, variant = 'default' }) {
  const isCompact = variant === 'compact';

  if (!provider) {
    return null;
  }

  return (
    <Card 
      className={`h-full group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card border-2 border-border/40 hover:border-(--primary-gradient-start)/30 relative overflow-hidden ${
        isCompact ? 'p-4' : 'p-6'
      }`}
      onClick={onClick}
    >
      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-(--primary-gradient-start)/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full justify-between">
        {/* Header */}
        <div>
        <div className={`flex items-start justify-between ${isCompact ? 'mb-3' : 'mb-4'}`}>
          <div className="flex flex-col space-x-3">
            <Avatar className={`${isCompact ? 'h-10 w-10' : 'h-12 w-12'} ring-2 mb-2 ring-border/20 group-hover:ring-(--primary-gradient-start)/30 transition-all duration-300`}>
              <AvatarImage src={provider.avatar} alt={provider.name} />
              <AvatarFallback className="bg-linear-to-br from-(--primary-gradient-start) to-(--primary-gradient-end) text-white">
                {provider.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                {provider.isVerified && (
                  <CheckCircle className={`text-(--primary-gradient-start) ${
                    isCompact ? 'w-3 h-3' : 'w-4 h-4'
                  }`} />
                )}
                <h3 className={`font-semibold group-hover:text-(--primary-gradient-start) transition-colors duration-200 ${
                  isCompact ? 'text-sm' : 'text-base'
                }`}>
                  {provider.name}
                </h3>
              </div>
              <p className={`text-muted-foreground ${isCompact ? 'text-xs' : 'text-sm'}`}>
                {provider.location}
              </p>
            </div>
          </div>
          
          {/* Availability Status */}
          <div className="flex flex-col items-end space-y-1">
            <Badge 
              variant={provider.availability === 'available' ? 'default' : 'secondary'}
              className={`${
                provider.availability === 'available' 
                  ? 'bg-success text-success-foreground' 
                  : provider.availability === 'busy'
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-muted text-muted-foreground'
              } ${isCompact ? 'text-xs px-2 py-0.5' : 'text-xs'}`}
            >
              {provider.availability}
            </Badge>
            {!isCompact && (
              <p className="text-xs text-muted-foreground flex items-center">
                <Clock className="w-3 h-3 ml-3 mr-1" />
                {provider.responseTime}
              </p>
            )}
          </div>
        </div>

        {/* Skills */}
        <div className={`${isCompact ? 'mb-3' : 'mb-4'}`}>
          <div className="flex flex-wrap gap-1.5">
            {provider.skills.slice(0, isCompact ? 2 : 3).map((skill) => (
              <Badge 
                key={skill}
                variant="outline" 
                className={`bg-background/50 border-border/40 hover:border-(--primary-gradient-start)/40 transition-colors duration-200 ${
                  isCompact ? 'text-xs px-2 py-0.5' : 'text-xs'
                }`}
              >
                {skill}
              </Badge>
            ))}
            {provider.skills.length > (isCompact ? 2 : 3) && (
              <Badge variant="outline" className={`bg-muted/50 ${isCompact ? 'text-xs px-2 py-0.5' : 'text-xs'}`}>
                +{provider.skills.length - (isCompact ? 2 : 3)}
              </Badge>
            )}
          </div>
        </div>

        {/* Bio */}
        {!isCompact && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
            {provider.bio}
          </p>
        )}
        </div>

        {/* Stats */}
        <div>
        <div className={`flex items-center justify-between ${isCompact ? 'mb-3' : 'mb-4'}`}>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Star className={`text-yellow-500 fill-current ${isCompact ? 'w-3 h-3' : 'w-4 h-4'}`} />
              <span className={`font-medium ${isCompact ? 'text-xs' : 'text-sm'}`}>
                {provider.rating}
              </span>
              <span className={`text-muted-foreground ${isCompact ? 'text-xs' : 'text-sm'}`}>
                ({provider.reviewCount})
              </span>
            </div>
            {!isCompact && (
              <div className="flex items-center space-x-1 text-muted-foreground text-sm">
                <MapPin className="w-3 h-3" />
                <span>{provider.distance}</span>
              </div>
            )}
          </div>
          
          <div className="text-right">
            <p className={`font-bold text-(--primary-gradient-start) ${
              isCompact ? 'text-sm' : 'text-base'
            }`}>
              ${provider.hourlyRate}/hr
            </p>
            {!isCompact && (
              <p className="text-xs text-muted-foreground">
                {provider.completedJobs} jobs
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`flex  gap-2 ${isCompact ? '' : 'pt-2 border-t border-border/30'}`}>
          <Button 
            size={isCompact ? "sm" : "default"}
            className="flex-1 bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
          >
            Hire Now
          </Button>
          {!isCompact && (
            <Button 
              size="default"
              variant="outline" 
              className="flex-1 border-border/40 hover:border-(--primary-gradient-start)/40 hover:bg-(--primary-gradient-start)/5 transition-all duration-200"
              onClick={(e) => {
                e.stopPropagation();
                // Would typically open chat
                console.log('Open chat with', provider.name);
              }}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Message
            </Button>
          )}
        </div>
        </div>
      </div>
    </Card>
  );
}