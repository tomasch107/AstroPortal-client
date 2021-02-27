import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/_services/error-service.service';
import { TokenStorageService } from '../../../_services/token-storage.service';
import { UserService } from '../../../_services/user.service';
import { UserProfile } from '../../model/user-profile';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.scss']
})
export class FollowingComponent implements OnInit {
  watched: Observable<any[]>;
  profileId;
  selected = new Array();
  constructor(private tokenService: TokenStorageService,
    private userService: UserService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.profileId = + this.tokenService.getCurrentProfileId()
    this.getWatchedUsers();
  }

  getWatchedUsers(){
    this.userService.getWatchedUsers(this.profileId).subscribe(data => {
      this.watched = of(data);
      console.log(data);
    },
    (err) => {
      this.messageService.showError(err);
    })

  }
}
