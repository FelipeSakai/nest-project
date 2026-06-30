import { WatchedList } from "./watched-list";

class NumberWatchedList extends WatchedList<number> {
    compareItems(a: number, b: number): boolean {
        return a === b
    }

}

describe("WatchedList", () => {
    it("should be able to create a watched list with initial items", () => {
        const watchedList = new NumberWatchedList([1, 2, 3])

        expect(watchedList.getItems()).toHaveLength(3)
    })

    it("should be able to add new items to the list", () => {
        const watchedList = new NumberWatchedList([1, 2, 3])

        watchedList.add(4)

        expect(watchedList.getItems()).toHaveLength(4)
        expect(watchedList.getNewItems()).toEqual([4])
    })

    it("should be able to remove items from the list", () => {
        const watchedList = new NumberWatchedList([1, 2, 3])

        watchedList.remove(2)

        expect(watchedList.getItems()).toHaveLength(2)
        expect(watchedList.getRemovedItems()).toEqual([2])
    })

    it("should be able to add an item even if it was removed before", () => {
        const watchedList = new NumberWatchedList([1, 2, 3])

        watchedList.remove(2)
        watchedList.add(2)

        expect(watchedList.getItems()).toHaveLength(3)
        expect(watchedList.getRemovedItems()).toEqual([])
        expect(watchedList.getNewItems()).toEqual([])
    })

    it("should be able to remove an item even if it was added before", () => {
        const watchedList = new NumberWatchedList([1, 2, 3])

        watchedList.add(4)
        watchedList.remove(4)

        expect(watchedList.getItems()).toHaveLength(3)
        expect(watchedList.getRemovedItems()).toEqual([])
        expect(watchedList.getNewItems()).toEqual([])
    })

    it("should be able to update watched list items", () => {
        const watchedList = new NumberWatchedList([1, 2, 3])

        watchedList.update([2, 3, 4])

        expect(watchedList.getRemovedItems()).toEqual([1])
        expect(watchedList.getNewItems()).toEqual([4])
    })
})
