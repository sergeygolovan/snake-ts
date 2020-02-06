export interface Position {
    x: number;
    y: number;
}

export function isPositionsEqual(p1: Position, p2: Position): boolean { return p1.x == p2.x && p1.y == p2.y };
export function getDistance(p1: Position, p2: Position): number { return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)) }
export function findNearestObject() {
    
}

export interface Size {
    width: number;
    height: number;
}

export interface Direction {
    dx: number;
    dy: number;
}