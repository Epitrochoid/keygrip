export interface Push<State, Event> {
    type: 'push';
    scene: Scene<State, Event>;
}

export interface Replace<State, Event> {
    type: 'replace';
    scene: Scene<State, Event>;
}

export interface Pop {
    type: 'pop';
}

export interface None {
    type: 'none';
}

export type SceneSwitch<State, Event> = None | Pop | Push<State, Event> | Replace<State, Event>;

export interface Scene<State, Event> {
    onPush(state: State): SceneSwitch<State, Event>;
    onPop(state: State): void;

    update(state: State): SceneSwitch<State, Event>;
    draw(state: State): void;
    input(state: State, event: Event): void;

    update_down(): boolean;
    draw_down(): boolean;
    input_down(): boolean;
}
