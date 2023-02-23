import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ArtistData } from '../data/artist-data';
import { AlbumData } from '../data/album-data';
import { TrackData } from '../data/track-data';
import { ResourceData } from '../data/resource-data';
import { ProfileData } from '../data/profile-data';
import { TrackFeature } from '../data/track-feature';
@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
	expressBaseUrl:string = 'http://localhost:8888';

  constructor(private http:HttpClient) { }

  private sendRequestToExpress(endpoint:string):Promise<any> {
    //TODO: use the injected http Service to make a get request to the Express endpoint and return the response.
    //the http service works similarly to fetch(). It may be useful to call .toPromise() on any responses.
    //update the return to instead return a Promise with the data from the Express server
    //Note: toPromise() is a deprecated function that will be removed in the future.
    //It's possible to do the assignment using lastValueFrom, but we recommend using toPromise() for now as we haven't
    //yet talked about Observables. https://indepth.dev/posts/1287/rxjs-heads-up-topromise-is-being-deprecated
    
    return firstValueFrom(this.http.get(this.expressBaseUrl + endpoint)).then((response) => {
      // console.log("RESPONSE: " + response);
      return response;
    }, (err) => {
      return err;
    });

    // return Promise.resolve();
  }

  aboutMe():Promise<ProfileData> {
    //This line is sending a request to express, which returns a promise with some data. We're then parsing the data 
    return this.sendRequestToExpress('/me').then((data) => {
      return new ProfileData(data);
    });
  }

  searchFor(category:string, resource:string):Promise<ResourceData[]> {
    //TODO: identify the search endpoint in the express webserver (routes/index.js) and send the request to express.
    //Make sure you're encoding the resource with encodeURIComponent().
    //Depending on the category (artist, track, album), return an array of that type of data.
    //JavaScript's "map" function might be useful for this, but there are other ways of building the array.
    
    if (category === "artist") {
      let artistArray:ArtistData[] = [];

      return this.sendRequestToExpress('/search/artist/' + encodeURIComponent(resource)).then((data) => {
        data["artists"]["items"].forEach((featent) => {
          artistArray.push(new ArtistData(featent));
        });
        return artistArray;
      });
    }

    if (category === "album") {
      let albumArray:AlbumData[] = [];
      return this.sendRequestToExpress('/search/album/' + encodeURIComponent(resource)).then((data) => {
        data["albums"]["items"].forEach((featent) => {
          albumArray.push(new AlbumData(featent));
        });
        return albumArray;
      });
    }

    if (category === "track") {
      let trackArray:TrackData[] = [];
      return this.sendRequestToExpress('/search/track/' + encodeURIComponent(resource)).then((data) => {
        data["tracks"]["items"].forEach((featent) => {
          trackArray.push(new TrackData(featent));
        });
        return trackArray;
      });
    }

    return null as any;
  }

  getArtist(artistId:string):Promise<ArtistData> {
    //TODO: use the artist endpoint to make a request to express.
    //Again, you may need to encode the artistId.
    return this.sendRequestToExpress('/artist/' + encodeURIComponent(artistId)).then((data) => {
      return new ArtistData(data); // ArtistData object created to store the artist in
    });
    return null as any;
  }

  getRelatedArtists(artistId:string):Promise<ArtistData[]> {
    return this.sendRequestToExpress('/artist-related-artists/' + encodeURIComponent(artistId)).then((data) => {
      let relatedArtists:ArtistData[] = []; // array to store related artists in
      data["artists"].forEach((featent) => {
        relatedArtists.push(new ArtistData(featent)); // each track in the list of related artists pushed to the array
      });
      return relatedArtists;
    });
   return null as any;
  }

  getTopTracksForArtist(artistId:string):Promise<TrackData[]> {
    return this.sendRequestToExpress('/artist-top-tracks/' + encodeURIComponent(artistId)).then((data) => {
      let topTracks:TrackData[] = []; // array to store top tracks in
      data["tracks"].forEach((featent) => {
        topTracks.push(new TrackData(featent)); // each track in the list of top tracks is pushed to the array
      });
      return topTracks;
    });
    return null as any;
  }

  getAlbumsForArtist(artistId:string):Promise<AlbumData[]> {
    return this.sendRequestToExpress('/artist-albums/' + encodeURIComponent(artistId)).then((data) => {
      let albums:AlbumData[] = []; // array to store albums in
      data["items"].forEach((featent) => {
        albums.push(new AlbumData(featent)); // each album in the list of albums pushed to array
      });
      return albums;
    })

    return null as any;
  }

  getAlbum(albumId:string):Promise<AlbumData> {
    return this.sendRequestToExpress('/album/' + encodeURIComponent(albumId)).then((data) => {
      return new AlbumData(data); // turn album into AlbumData object
    })
    return null as any;
  }

  getTracksForAlbum(albumId:string):Promise<TrackData[]> {
    let tracklist:TrackData[] = []; // array to hold the tracks
    let albumTracks; // temporary holder var
    return this.sendRequestToExpress('/album-tracks/' + encodeURIComponent(albumId)).then((data) => {
      albumTracks = data["items"]; // album tracks holds the list of tracks on the albums
      albumTracks.forEach((element) => {
        this.sendRequestToExpress('/track/' + encodeURIComponent(element.id)).then((result) => {
          tracklist.push(new TrackData(result)); //each track is turned into a TrackData object and pushed to tracklist
        });
      });
      return tracklist;
    });
  }

  getTrack(trackId:string):Promise<TrackData> {
    //TODO: use the track endpoint to make a request to express.
    return this.sendRequestToExpress("/track/" + encodeURIComponent(trackId)).then((data) => {
      return new TrackData(data); //Data is to take the form TrackData
    })

    return null as any;
  }

  getAudioFeaturesForTrack(trackId:string):Promise<TrackFeature[]> {
    //TODO: use the audio features for track endpoint to make a request to express.
    return this.sendRequestToExpress("/track-audio-features/" + encodeURIComponent(trackId)).then((data) => {
      console.log("SHOWING TRACK FEATURES:");
      console.log(data);

      //The array that will hold the data of track features.
      let trackFeatures:TrackFeature[]=[];
      //Looking at TrackFeature from data, it has a static property that enumerates all the features visible in a track.
      //Loop through those, then push it onto our new array trackFeatures
      TrackFeature.FeatureTypes.forEach((feat) => {
        trackFeatures.push(new TrackFeature(feat, data[feat]));
      })

      console.log(trackFeatures);

      return trackFeatures;
    })
    return null as any;
  }
}