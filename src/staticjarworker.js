let listeners = [];
let currentVersion = null;

export function setVersion(version) {
    currentVersion = version;
    listeners.forEach(cb => cb(version));
}

export function onVersionChange(cb) {
    listeners.push(cb);
    if (currentVersion) cb(currentVersion);
}
