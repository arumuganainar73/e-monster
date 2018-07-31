import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    HostBinding,
    HostListener,
    Input,
    OnInit, Output
} from '@angular/core';
import { ENTER, SPACE } from '@angular/cdk/keycodes';

@Component({
    selector: 'app-album-card',
    templateUrl: './album-card.component.html',
    styleUrls: ['./album-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlbumCardComponent implements OnInit {

    @Input() imageUrl: string;

    @Input() name: string;

    @Input() artists: any[];

    @Output() select = new EventEmitter<any>();

    @HostBinding('attr.role')
    get albumCardRole(): string {
        return 'link';
    }

    @HostBinding('attr.tabindex')
    get talbumCardTabindex(): number {
        return 0;
    }

    get artistNames(): string[] {
        return this.artists ?
            this.artists.map(( artist ) => artist.name) : null;
    }

    constructor() {
    }

    ngOnInit() {
    }

    @HostListener('click', ['$event'])
    public handleClickOnHost( event: any ): void {
        this.select.emit(event);
        event.preventDefault();
        return;
    }

    @HostListener('keydown', ['$event'])
    public handleKeydownOnHost( event: KeyboardEvent ): void {
        switch (event.keyCode) {
            case ENTER:
            case SPACE:
                this.select.emit(event);
                event.preventDefault();
                return;

            default:
                return;
        }
    }
}
