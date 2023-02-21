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
        data["artists"]["items"].forEach((element) => {
          artistArray.push(new ArtistData(element));
        });
        return artistArray;
      });
    }

    if (category === "album") {
      let albumArray:AlbumData[] = [];
      return this.sendRequestToExpress('/search/album/' + encodeURIComponent(resource)).then((data) => {
        data["albums"]["items"].forEach((element) => {
          albumArray.push(new AlbumData(element));
        });
        return albumArray;
      });
    }

    if (category === "track") {
      let trackArray:TrackData[] = [];
      return this.sendRequestToExpress('/search/track/' + encodeURIComponent(resource)).then((data) => {
        data["tracks"]["items"].forEach((element) => {
          trackArray.push(new TrackData(element));
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
      data["artists"].forEach((element) => {
        relatedArtists.push(new ArtistData(element)); // each track in the list of related artists pushed to the array
      });
      return relatedArtists;
    });
   return null as any;
  }

  getTopTracksForArtist(artistId:string):Promise<TrackData[]> {
    return this.sendRequestToExpress('/artist-top-tracks/' + encodeURIComponent(artistId)).then((data) => {
      let topTracks:TrackData[] = []; // array to store top tracks in
      data["tracks"].forEach((element) => {
        topTracks.push(new TrackData(element)); // each track in the list of top tracks is pushed to the array
      });
      return topTracks;
    });
    return null as any;
  }

  getAlbumsForArtist(artistId:string):Promise<AlbumData[]> {
    return this.sendRequestToExpress('/artist-albums/' + encodeURIComponent(artistId)).then((data) => {
      let albums:AlbumData[] = []; // array to store albums in
      data["items"].forEach((element) => {
        albums.push(element); // each album in the list of albums pushed to array
      });
      return albums;
    })

    return null as any;
  }

  getAlbum(albumId:string):Promise<AlbumData> {
    //TODO: use the album endpoint to make a request to express.
    return null as any;
  }

  getTracksForAlbum(albumId:string):Promise<TrackData[]> {
    //TODO: use the tracks for album endpoint to make a request to express.
    return null as any;
  }

  getTrack(trackId:string):Promise<TrackData> {
    //TODO: use the track endpoint to make a request to express.
    return null as any;
  }

  getAudioFeaturesForTrack(trackId:string):Promise<TrackFeature[]> {
    //TODO: use the audio features for track endpoint to make a request to express.
    return null as any;
  }
}