import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import { PapaParseService } from 'ngx-papaparse';

import * as firebase from 'firebase';

@Injectable()
export class NewPortfolioUploadService {

  database: firebase.firestore.CollectionReference;

  private numOfUploadedDocs = 0;
  private numTotalDocs = 0;


  constructor(private afAuth: AngularFireAuth, private papa: PapaParseService) {
    this.database = firebase.firestore().collection(this.afAuth.auth.currentUser.uid).doc('portfolios').collection('data');
  }

  uploadCSVFiles(keyCSV: any, capCSV: any, loadCSV: any, profileCSV: any, portfolioName: string) {
    this.processKeyCSV(keyCSV).then((keyData) => {
      this.processCapCSV(capCSV).then((capData) => {
        this.processLoadCSV(loadCSV).then((loadData) => {
          this.processProfileCSV(profileCSV).then((profileData) => {
            console.log(keyData);
            this.uploadFiles(keyData, capData, loadData, profileData, portfolioName);
          });
        });
      });
    });
  }

  uploadFiles(keyData: Object, capData: Object, loadData: Object, profileData: Object, portfolioName: string) {
    if (portfolioName !== '') {
      this.numTotalDocs = Object.keys(keyData).length + Object.keys(capData).length + Object.keys(loadData).length + Object.keys(profileData).length;
      this.numOfUploadedDocs = 0;
      this.uploadData(keyData, 'key', portfolioName).then(() => {
        this.uploadData(capData, 'capacity', portfolioName).then(() => {
          this.uploadData(loadData, 'load', portfolioName).then(() => {
            this.uploadData(profileData, 'profile', portfolioName).then(() => {
              firebase.firestore().collection(`${this.afAuth.auth.currentUser.uid}`).doc('portfolios').collection('names').doc(portfolioName).set({ name: portfolioName }, { merge: true });
            });
          });
        });
      });
    }
  }

  uploadData(data: any, collectionName: string, portfolioName: string): Promise<any> {
    if (Object.keys(data).length <= 0) {
      console.log(`${collectionName} - Finished Uploading`);
      return Promise.resolve(true);
    }
    const keyRef = this.database.doc(portfolioName).collection(collectionName);
    const batch = firebase.firestore().batch();
    let i = 0;
    while (i < 50 && Object.keys(data).length > 0) {
      const key = Object.keys(data)[0];
      const eleRef = keyRef.doc(key);
      batch.set(eleRef, data[key]);
      delete data[key];
      i++;
    }
    return batch.commit().then(() => {
      this.numOfUploadedDocs = this.numOfUploadedDocs + i;
      console.log(((this.numOfUploadedDocs / this.numTotalDocs) * 100) + '%');
      return this.uploadData(data, collectionName, portfolioName);
    });
  }

  processKeyCSV(keyCSV: any): Promise<Object> {
    return new Promise((complete) => {
      const keyData = {};
      this.papa.parse(keyCSV, {
        complete: (results) => {
          const columns = this.arrayToLowerCase(results.data[0]);
          const idIdx = columns.indexOf('id');
          const staIdx = columns.indexOf('station name');
          const typeIdx = columns.indexOf('fuel type');
          const profIdx = columns.indexOf('profile');
          const renewIdx = columns.indexOf('renewable');
          for (let i = 1; i < results.data.length; i++) {
            const id = Number.parseInt(results.data[i][idIdx]);
            const stationName = results.data[i][staIdx].toLowerCase();
            const fuelType = results.data[i][typeIdx].toLowerCase();
            const profile = results.data[i][profIdx].toLowerCase();
            const renewable = (results.data[i][renewIdx] === 'TRUE' ? true : false);
            const stationKey = `${id} - ${stationName}`;
            keyData[stationKey] = {
              'id': id,
              'station name': stationName,
              'fuel type': fuelType,
              'profile': profile,
              'renewable': renewable
            };
          }
          return complete(keyData);
        }
      });
    });
  }

  processCapCSV(capCSV: any): Promise<Object> {
    return new Promise((complete) => {
      const capData = {};
      this.papa.parse(capCSV, {
        complete: (results) => {
          const columns = this.arrayToLowerCase(results.data[0]);
          const idIdx = columns.indexOf('id');
          const yearIdx = columns.indexOf('year');
          const capIdx = columns.indexOf('capacity');
          for (let i = 1; i < results.data.length; i++) {
            const id = Number.parseInt(results.data[i][idIdx]);
            const year = Number.parseInt(results.data[i][yearIdx]);
            const capacity = Number.parseFloat(results.data[i][capIdx].replace(/,/g, ''));
            if (!capData.hasOwnProperty(year)) {
              capData[year] = {};
              capData[year]['year'] = year;
            }
            capData[year][id] = capacity;
          }
          return complete(capData);
        }
      });
    });
  }

  processLoadCSV(loadCSV: any): Promise<Object> {
    return new Promise((complete) => {
      const loadData = {};
      this.papa.parse(loadCSV, {
        complete: (results) => {
          const columns = this.arrayToLowerCase(results.data[0]);
          const timeIdx = columns.indexOf('time');
          const loadIdx = columns.indexOf('load');
          for (let i = 1; i < results.data.length; i++) {
            const time = new Date(results.data[i][timeIdx]);
            const load = Number.parseFloat(results.data[i][loadIdx].replace(/,/g, ''));
            const hour = time.getHours();
            const dateKey = new Date(time.getFullYear(), time.getMonth(), time.getDate()).toDateString().split(' ').slice(1, 4).join(' ');
            if (!loadData.hasOwnProperty(dateKey)) {
              loadData[dateKey] = {};
              loadData[dateKey]['time'] = time;
            }
            loadData[dateKey][hour] = load;
          }
          return complete(loadData);
        }
      });
    });
  }

  processProfileCSV(profileCSV: any): Promise<Object> {
    return new Promise((complete) => {
      const profileData = {};
      this.papa.parse(profileCSV, {
        complete: (results) => {
          const columns = this.arrayToLowerCase(results.data[0]);
          const indexs = {};
          for (let i = 0; i < columns.length; i++) {
            indexs[columns[i]] = i;
          }
          for (let i = 1; i < results.data.length; i++) {
            const row = {};
            const time = new Date(results.data[i][indexs['time']]);
            const hour = time.getHours();
            const dateKey = new Date(time.getFullYear(), time.getMonth(), time.getDate()).toDateString().split(' ').slice(1, 4).join(' ');
            if (!profileData.hasOwnProperty(dateKey)) {
              profileData[dateKey] = {};
              profileData[dateKey]['time'] = time;
            }
            if (!profileData[dateKey].hasOwnProperty(hour)) {
              profileData[dateKey][hour] = {};
            }
            for (let j = 0; j < columns.length; j++) {
              if (columns[j] !== 'time') {
                profileData[dateKey][hour][columns[j]] = Number.parseFloat(results.data[i][indexs[columns[j]]].replace(/,/g, ''));
              }
            }
          }
          return complete(profileData);
        }
      });
    });
  }

  arrayToLowerCase(input) {
    return input.join('|').toLowerCase().split('|');
  }

}
