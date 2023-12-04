import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Player, Replay, parseCommand, parseReplay } from '@canyougiant/aoe3de-replay-parser/dist';
import { JsonService } from '../services/json.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    public replays: {
        replay: Replay,
        fileName: string,
        lastModifiedDate: Date,
        resignIds: number[]
    }[] = [];

    constructor(private router: Router, private jsonService: JsonService) { }

    public async ngOnInit(): Promise<void> {
        let chooser = document.getElementById('folder-chooser');
        chooser?.addEventListener('change', (ev) => {
            this.onSelectFolderAsync(ev);
        });
    }

    private async onSelectFolderAsync(ev: any): Promise<void> {
        let files: File[] = Object.values(ev.target.files);
        let recs = files.filter(file => file.name.endsWith('.age3Yrec')).sort((a, b) => b.lastModified - a.lastModified);
        this.replays = [];
        for (let rec of recs) {
            let buffer = await rec.arrayBuffer();
            let replay: Replay | null = null;
            let resignIds: number[] = [];
            try {
                replay = parseReplay(buffer);
                let commands = parseCommand(buffer);
                for (let resign of commands.resigns) {
                    resignIds.push(resign.slotId);
                }
                this.replays.push({
                    replay: replay,
                    fileName: rec.name,
                    lastModifiedDate: new Date(rec.lastModified),
                    resignIds: resignIds,
                });
            } catch (e) {
                console.error(e);
            }
        }
    }

    public getPlayerBySlotId(rec: Replay, slotId: number): Player {
        return rec.players.filter(player => player.slotId == slotId)[0];
    }

    public IsResign(replay: {
        replay: Replay,
        fileName: string,
        resignIds: number[]
    }, slotId: number): boolean {
        return replay.resignIds.includes(slotId);
    }
}