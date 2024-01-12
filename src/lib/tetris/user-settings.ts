
export default class UserSettings {
    private static __instance: UserSettings;
    private constructor() {}

    static get_instance(): UserSettings {
        if (!UserSettings.__instance) {
            UserSettings.__instance = new UserSettings();
        }

        return UserSettings.__instance;
    }
}
