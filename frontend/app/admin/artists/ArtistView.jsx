import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export function ArtistView({ artist, onClose }) {
  return (
    <Card className="max-w-4xl mx-auto bg-card/50 backdrop-blur-sm border-2">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-2xl bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          View Artist: {artist?.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50">
            <TabsTrigger value="basic" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="details" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
              Details
            </TabsTrigger>
            <TabsTrigger value="media" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
              Media
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-6">
            <div>
              <Label className="text-sm font-medium text-foreground">Artist Name</Label>
              <p className="mt-1 text-foreground bg-background border border-border rounded-md p-2">
                {artist?.name || 'N/A'}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground">Biography</Label>
              <p className="mt-1 text-foreground bg-background border border-border rounded-md p-2 whitespace-pre-wrap">
                {artist?.bio || 'N/A'}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground">Followers</Label>
              <p className="mt-1 text-foreground bg-background border border-border rounded-md p-2">
                {artist?.followers?.toLocaleString() || '0'}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4 mt-6">
            <div>
              <Label className="text-sm font-medium text-foreground">Genres</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {artist?.genres?.length > 0 ? (
                  artist.genres.map((genre, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1 bg-blue-500/20 text-blue-400 border-blue-500/30"
                    >
                      {genre}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No genres available</p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="media" className="space-y-4 mt-6">
            <div>
              <Label className="text-sm font-medium text-foreground">Profile Image URL</Label>
              <p className="mt-1 text-foreground bg-background border border-border rounded-md p-2 break-all">
                {artist?.image || 'N/A'}
              </p>
              {artist?.image && (
                <div className="mt-2">
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="max-w-xs rounded-md border border-border"
                    onError={(e) => (e.target.src = '/placeholder.png')} // Fallback image
                  />
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-6 border-t border-border">
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}