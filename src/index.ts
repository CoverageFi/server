// Copyright (c) 2024, Circle Technologies, LLC. All rights reserved.
//
// SPDX-License-Identifier: Apache-2.0
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { app } from './app';
import { initDB, cleanupDB } from './services/db/sqlite/sqliteDB';
import {
  logger,
  registerLogger,
  ServerLogger
} from './services/logging/logger';

registerLogger(new ServerLogger());
initDB();

const port = process.env.PORT ?? 8080;
const server = app.listen(port, () => {
  logger.info(`Server is running at http://localhost:${port}`);
});

process.on('SIGINT', function () {
  cleanupDB();
  server.close();
  logger.info('Server closed successfully');
});
