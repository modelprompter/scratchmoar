<template>
<div ref="menu" class="menu-bar_menu-bar-item_scratchmoar">
  <span class="scratchmoar-favicon" @click="isVisible = !isVisible">Scratchmoar</span>

  <div :class="{scratchmoarHidden: !isVisible, scratchmoarPopup: true}">
    <div class="scratchmoarOverlay" @click="isVisible = false"></div>
    <div class="scratchmoarPopupContent">
      <div class="scratchmoarPopupContentHeader">
        <h2 class="scratchmoar-favicon">Scratchmoar: <i>Snapshots</i></h2>
      </div>
      <div class="scratchmoarPopupContentBody">
        <table>
          <thead>
            <tr>
              <th width="40px">ID</th>
              <th width="100px">Title</th>
              <th width="100px">Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="snapshot in snapshots" :key="snapshot.id" :class="{scratchmoarPositive: lastSnapshotID?.value === snapshot.id}">
              <td>{{ snapshot.id }}</td>
              <!-- Display date in YY-MM-DD HH:MM format -->
              <td>{{ snapshot.title }}</td>
              <td>{{ new Date(snapshot.date).toLocaleString().slice(0, -2).replace(/:\d{2}\s/, ' ') }}</td>
              <td>
                <button title="Delete this snapshot" class="scratchmoarNegative" @click="deleteSnapshot(snapshot.id)" style="margin-right: 2rem">Delete</button>
                <button title="Overwrite this snapshot with active project" class="scratchmoarWarning" @click="updateSnapshot(snapshot.id)">Update</button>
                <button title="Replace active project with this snapshot" class="scratchmoarInfo" @click="loadSnapshot(snapshot.id)" style="float: right">Load</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="scratchmoarPopupContentFooter">
        <button title="Frees up all snapshots from the browser" class="scratchmoarNegative" @click="clearSnapshots()" >Delete all snapshots</button>
        <button title="Stores a new snapshot to the browser" class="scratchmoarInfo" @click="saveSnapshots()" style="float: right">Save new snapshot</button>
        <button title="Downloads all snapshots as one file" class="scratchmoarPositive" @click="downloadSnapshots()" style="float: right; margin-right: .5rem">Download snapshots file</button>
        <button title="Loads a snapshot file into the browser" class="scratchmoarWarning" @click="loadSnapshots()" style="float: right; margin-right: .5rem">Load snapshots file...</button>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import Snapshots from './store/snapshots.js'
import { liveQuery } from 'dexie'
import { useObservable } from '@vueuse/rxjs'

const vm = getCurrentInstance()
const menu = ref(null)
const isVisible = ref(false)
const forceRenderer = ref(false) // For forcing a re-render
let snapshots = resetSnapshotsRef()

// Resets snapshots reference
function resetSnapshotsRef () {
  return ref(useObservable(liveQuery(() => {
    return Snapshots.snapshots.toArray()
  })))
}

/**
 * Observe settings
 * Also sets lastSnapshotID
 */
let lastSnapshotID = ref(null)
let settings = ref(useObservable(liveQuery(async () => {
  const data = await Snapshots.settings.toArray()
  
  // Find first {key: 'lastSnapshotID'} and set lastSnapshotID
  if (data && data.length) {
    lastSnapshotID = data.find(setting => {
      if (setting.key === 'lastSnapshotID') {
        vm.proxy.$forceUpdate()
        return setting.value
      }
    })
  }

  return data
})))

onMounted(() => {
  // Add matching classes for styling purposes
  const $menuItem = document.querySelector('[class*="menu-bar_menu-bar-item_"][class*="menu-bar_hoverable_"]:not([class*="menu-bar_language-menu_"])')
  $menuItem.classList.forEach(className => menu.value.classList.add(className))

  // Manually match list item styles
  let styles = getComputedStyle(document.querySelector('[class*="gui_page-wrapper_"] > [class*="menu-bar_menu-bar"]'))
  const $menuItems = document.querySelectorAll('.menu-bar_menu-bar-item_snapshots li')
  $menuItems.forEach($menuItem => {
    $menuItem.style.backgroundColor = styles.backgroundColor
  })

  // Listeners
  document.addEventListener('snapshotsLoadedProject', () => isVisible.value = false)
  document.addEventListener('databaseResetFinished', () => {
    snapshots = resetSnapshotsRef()
    vm.proxy.$forceUpdate()
  })
})

/**
 * Trigger a clear data event
 */
function clearSnapshots () {
  document.dispatchEvent(new CustomEvent('snapshotsResetDB'))
}

/**
 * Trigger a save snapshot event
 */
function saveSnapshots () {
  document.dispatchEvent(new CustomEvent('snapshotsSaveSnapshot'))
  isVisible.value = false
}

/**
 * Trigger a load snapshot event
 */
function loadSnapshot (id) {
  document.dispatchEvent(new CustomEvent('snapshotsLoadSnapshot', { detail: id }))
}

/**
 * Trigger a delete snapshot event
 */
function deleteSnapshot (id) {
  document.dispatchEvent(new CustomEvent('snapshotsDeleteSnapshot', { detail: id }))
}

/**
 * Trigger an update snapshot event
 */
function updateSnapshot (id) {
  document.dispatchEvent(new CustomEvent('snapshotsUpdateSnapshot', { detail: id }))
  isVisible.value = false
}

/**
 * Trigger a download snapshots event
 */
function downloadSnapshots () {
  document.dispatchEvent(new CustomEvent('snapshotsDownloadSnapshots'))
  isVisible.value = false
}

/**
 * Trigger a load snapshots event
 */
function loadSnapshots () {
  document.dispatchEvent(new CustomEvent('snapshotsLoadSnapshots'))
}
</script>
