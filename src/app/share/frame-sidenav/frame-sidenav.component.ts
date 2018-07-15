import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-frame-sidenav',
    templateUrl: './frame-sidenav.component.html',
    styleUrls: ['./frame-sidenav.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FrameSidenavComponent implements OnInit, OnDestroy {

    @Input() title: string;

    @Input() listPage: number;

    @Input() listTotalPages: number;

    @Input() listQuery: string;

    @Input() currentOption: string;

    @Input() navList: Array<{ name: string, value: string, inform?: string }>;

    @Output() goToPage = new EventEmitter<any>();

    @Output() clickOption = new EventEmitter<any>();

    private _isLargeUp = false;

    private breakpointSub = Subscription.EMPTY;

    get showNavMenu(): boolean {
        return !this._isLargeUp;
    }

    get sidenavMenuName(): string {
        const current_item = this.navList.find(( option ) => option.value === this.currentOption);
        return current_item ? current_item.name : 'Menu';
    }

    get sidenavInfo(): string {
        const current_item = this.navList.find(( option ) => option.value === this.currentOption);
        return current_item ? current_item.inform : null;
    }

    constructor( private breakpointObserver: BreakpointObserver,
                 private cdRef: ChangeDetectorRef ) {
    }

    public ngOnInit() {
        this.breakpointSub = this.breakpointObserver
            .observe([
                '(min-width: 1024px)'
            ]).subscribe(result => {
                this._isLargeUp = result.matches;
                this.cdRef.markForCheck();
            });
    }

    public ngOnDestroy(): void {
        this.breakpointSub.unsubscribe();
    }

    public handleOptionClick( option: any, event: any ): void {
        this.clickOption.emit(option.value);
        event.preventDefault();
    }

    public prev( event: any ): void {
        this.toPage(this.listPage - 1);
        event.preventDefault();
    }

    public next( event: any ): void {
        this.toPage(this.listPage + 1);
        event.preventDefault();
    }

    private toPage( page: number ): void {
        if (page < 1 || page > this.listTotalPages) {
            return;
        }

        this.goToPage.next({type: this.currentOption, query: this.listQuery, page: page});
    }
}
