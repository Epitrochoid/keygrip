import { Scene, SceneSwitch } from './scene';

export class SceneStack<State, Event> {
    world: State;
    scenes: Array<Scene<State, Event>>;

    constructor(initialState: State) {
        this.world = initialState;
        this.scenes = [];
    }

    push(scene: Scene<State, Event>): void {
        this.scenes.push(scene);
        scene.onPush(this.world);
    }

    pop(): Scene<State, Event> {
        const scene = this.scenes.pop();
        if (!scene) {
            throw new Error('Attempt to pop empty SceneStack');
        } else {
            scene.onPop(this.world);
            return scene;
        }
    }

    runCommand(command: SceneSwitch<State, Event>): Scene<State, Event> | void {
        if (command.type === 'push') {
            this.push(command.scene);
        } else if (command.type === 'pop') {
            return this.pop();
        } else if (command.type === 'replace') {
            const oldScene = this.pop();
            this.push(command.scene);

            return oldScene;
        }

        return;
    }

    update(): void {
        const scenesToUpdate = [];
        // Create shallow copy and reverse
        const scenes = this.scenes.slice().reverse();

        if (this.scenes.length < 1) {
            return;
        }

        let updateNext;
        let sceneIndex = 0;
        do {
            scenesToUpdate.push(scenes[sceneIndex]);
            updateNext = scenes[sceneIndex].update_down();
            sceneIndex++;
        } while (updateNext);

        scenesToUpdate.forEach(scene => this.runCommand(scene.update(this.world)));
        return;
    }
}
