import { Component, OnInit } from '@angular/core';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  name:string = null;
  profile_pic:string = "../../../assets/unknown.jpg";
  profile_link:string = null;

  //TODO: inject the Spotify service
  constructor(private SpotifyService: SpotifyService) {
    console.log(SpotifyService.aboutMe());
   }

  ngOnInit() {
  }

  /*TODO: create a function which gets the "about me" information from Spotify when the button in the view is clicked.
  In that function, update the name, profile_pic, and profile_link fields */

  loadProfileInfo() {
    //Once SpotifyService gets a response from accessing info about aboutMe(), then replace name, profile_pic and profile_link with the response's
    this.SpotifyService.aboutMe().then((response)=> {
      //Because of the console.log on the constructor, we figured out the data that we get from the API request: name, imageURL, and spotifyProfile.
      this.name = response.name;
      this.profile_pic = response.imageURL;
      this.profile_link = response.spotifyProfile;
    })
  }
}
