import { Scene, SceneSwitch } from './scene';

function collectScenes<State, Event>(sceneList: Array<Scene<State, Event>>,
    testFunc: (s: Scene<State, Event>) => boolean): Array<Scene<State, Event>> | void {

    const scenesToUpdate = [];
    // Create shallow copy and reverse
    const scenes = sceneList.slice().reverse();

    if (sceneList.length < 1) {
        return;
    }

    let continueCollecting;
    let sceneIndex = 0;
    do {
        scenesToUpdate.push(scenes[sceneIndex]);
        continueCollecting = testFunc(scenes[sceneIndex]);
        sceneIndex++;
    } while (continueCollecting);
}

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
        const scenesToUpdate = collectScenes(this.scenes, s => s.update_down());

        if (scenesToUpdate) {
            scenesToUpdate.forEach(scene => this.runCommand(scene.update(this.world)));
        }
        return;
    }

    input(event: Event): void {
        const scenesToUpdate = collectScenes(this.scenes, s => s.input_down());

        if (scenesToUpdate) {
            scenesToUpdate.reduce((prevEvent, currScene) => {
                return currScene.input(this.world, prevEvent); 
            }, event);
        }
        return;
    }

    draw(): void {
        const scenesToDraw = collectScenes(this.scenes, s => s.draw_down());

        if (scenesToDraw) {
            scenesToDraw.forEach(scene => scene.draw(this.world));
        }
        return;
    }

    swapRoot(scene: Scene<State, Event>): void {
        while (this.scenes.length > 0) {
            this.pop();
        }
        this.push(scene);
    }
}
