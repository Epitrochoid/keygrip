export interface Push<State, Event> {
    kind: 'push';
    scene: Scene<State, Event>;
}

export interface Replace<State, Event> {
    kind: 'replace';
    scene: Scene<State, Event>;
}

export interface Pop {
    kind: 'pop';
}

export interface None {
    kind: 'none';
}

export type SceneSwitch<State, Event> = None | Pop | Push<State, Event> | Replace<State, Event>;

export interface Scene<State, Event> {
    update(state: State): SceneSwitch<State, Event>;
    draw(state: State): void;
    input(state: State, event: Event): void;
    continue_drawing(): boolean;
}
