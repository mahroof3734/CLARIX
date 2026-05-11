from django.core.management.base import BaseCommand
from users.models import User, ClassRoom

class Command(BaseCommand):
    help = 'Seed demo users and classrooms'

    def handle(self, *args, **kwargs):
        if User.objects.filter(username='teacher1').exists():
            self.stdout.write('Demo data already exists. Skipping.')
            return

        teacher = User.objects.create_user(
            username='teacher1', password='password123', email='teacher@edu.com',
            first_name='Dr. Priya', last_name='Menon', role='teacher', department='Computer Science'
        )
        teacher2 = User.objects.create_user(
            username='teacher2', password='password123', email='teacher2@edu.com',
            first_name='Prof. Rajan', last_name='Pillai', role='teacher', department='Mathematics'
        )
        s1 = User.objects.create_user(username='student1', password='password123', email='s1@edu.com', first_name='Arjun', last_name='Nair', role='student', student_id='CS2021001', department='Computer Science')
        s2 = User.objects.create_user(username='student2', password='password123', email='s2@edu.com', first_name='Deepa', last_name='Krishnan', role='student', student_id='CS2021002', department='Computer Science')
        s3 = User.objects.create_user(username='student3', password='password123', email='s3@edu.com', first_name='Rahul', last_name='Das', role='student', student_id='CS2021003', department='Computer Science')

        c1 = ClassRoom.objects.create(name='Data Structures & Algorithms', subject='CS301', teacher=teacher, class_code='CS301A')
        c1.students.add(s1, s2, s3)

        c2 = ClassRoom.objects.create(name='Discrete Mathematics', subject='MA201', teacher=teacher2, class_code='MA201B')
        c2.students.add(s1, s2)

        self.stdout.write(self.style.SUCCESS('✅ Demo data created!'))
        self.stdout.write('  Teacher:  teacher1 / password123')
        self.stdout.write('  Teacher:  teacher2 / password123')
        self.stdout.write('  Student:  student1 / password123')
        self.stdout.write('  Codes:    CS301A, MA201B')
