angular.module('oraApp.collaboration')
	.service('taskService', ['$resource', '$log',
		function($resource, $log) {
			var ROLE_MEMBER = 'member';
			var ROLE_OWNER  = 'owner';

			var backend = $resource('data/task-management/tasks/:taskId/:controller.json', { }, {
				query:  { method: 'GET', isArray: false },
				edit: { method: 'UPDATE' },
				joinTask: { method: 'POST', params: { controller: 'members' } },
				unjoinTask: { method: 'DELETE', params: { controller: 'members' } }
			});

			this.getTasks = function() {
				return this.tasks;
			};

			this.updateTasks = function() {
				this.tasks = backend.query({},
					function(value, responseHeaders) {
						$log.debug('success');
					},
					function(httpResponse) {
						$log.debug('error');
					});
				return this.tasks;
			};

			this.joinTask = function(task, user) {
				if(task.members === undefined) {
					task.members = {};
				}
				task.members[user.id] = {
					id: user.id,
					firstname: user.firstname,
					lastname: user.lastname,
					role: ROLE_MEMBER,
					picture: user.picture
				}
				backend.joinTask({ taskId: task.id }, { },
					function(value, responseHeaders) {
						$log.debug('success');
					},
					function(httpResponse) {
						$log.debug('error');
					});
			};

			this.unjoinTask = function(task, user) {
				delete task.members[user.id];
				backend.unjoinTask({ taskId: task.id }, { },
					function(value, responseHeaders) {
						$log.debug('success');
					},
					function(httpResponse) {
						$log.debug('error');
					});
			};

			this.createTask = function(task, user) {
				backend.save({ }, { subject: task.subject, streamID: task['ora:stream'].id },
					function(value, responseHeaders) {
						$log.debug(value);

					},
					function(httpResponse) {
						$log.debug('error');
					});
			}

			this.tasks = this.updateTasks();
		}]);